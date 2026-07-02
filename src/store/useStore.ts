import { create } from 'zustand';
import { Shoe } from '../lib/data';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  collection, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface CartItem extends Shoe {
  quantity: number;
}

interface AppState {
  user: FirebaseUser | null;
  authLoading: boolean;
  favorites: string[];
  cart: CartItem[];
  theme: 'light' | 'dark';

  // Unsubscribe callbacks to clean up listeners
  _cartUnsubscribe: (() => void) | null;
  _favsUnsubscribe: (() => void) | null;

  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setFavorites: (favorites: string[]) => void;
  initializeAuth: () => () => void;
  addToCart: (shoe: Shoe) => Promise<void>;
  removeFromCart: (shoeId: string) => Promise<void>;
  updateQuantity: (shoeId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleFavorite: (shoe: Shoe) => Promise<void>;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useStore = create<AppState>((set, get) => {
  return {
    user: null,
    authLoading: true,
    favorites: [],
    cart: [],
    theme: (typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' : 'light') || 'light',
    _cartUnsubscribe: null,
    _favsUnsubscribe: null,

    setUser: (user) => set({ user }),
    setFavorites: (favorites) => set({ favorites }),

    initializeTheme: () => {
      const theme = get().theme;
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },

    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light';
      set({ theme: newTheme });
      localStorage.setItem('theme', newTheme);
      const root = window.document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },

    initializeAuth: () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        // Unsubscribe existing snapshot listeners to prevent leaks/overlap
        const { _cartUnsubscribe, _favsUnsubscribe } = get();
        if (_cartUnsubscribe) _cartUnsubscribe();
        if (_favsUnsubscribe) _favsUnsubscribe();

        if (currentUser) {
          // 1. Sync User Profile Metadata
          const userRef = doc(db, 'users', currentUser.uid);
          try {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              createdAt: serverTimestamp()
            }, { merge: true });
          } catch (error) {
            console.error("Error syncing user profile:", error);
          }

          // 2. Merge local cart to Firestore if exists
          const localCartJson = localStorage.getItem('sneaker_cart');
          if (localCartJson) {
            try {
              const localCart: CartItem[] = JSON.parse(localCartJson);
              if (localCart.length > 0) {
                for (const item of localCart) {
                  const itemRef = doc(db, 'users', currentUser.uid, 'cart', item.id);
                  await setDoc(itemRef, {
                    ...item,
                    quantity: increment(item.quantity),
                    updatedAt: serverTimestamp()
                  }, { merge: true });
                }
                localStorage.removeItem('sneaker_cart');
              }
            } catch (e) {
              console.error("Error merging local cart:", e);
            }
          }

          // 3. Set up Real-time Cart Listener
          const cartRef = collection(db, 'users', currentUser.uid, 'cart');
          const cartUnsub = onSnapshot(cartRef, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            })) as any[];
            set({ cart: items as CartItem[] });
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/cart`);
          });

          // 4. Set up Real-time Favorites Listener
          const favsRef = collection(db, 'users', currentUser.uid, 'favorites');
          const favsUnsub = onSnapshot(favsRef, (snapshot) => {
            const favIds = snapshot.docs.map(doc => doc.id);
            set({ favorites: favIds });
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/favorites`);
          });

          set({
            user: currentUser,
            authLoading: false,
            _cartUnsubscribe: cartUnsub,
            _favsUnsubscribe: favsUnsub
          });
        } else {
          // Logged out: clean up and load local cart
          let localCart: CartItem[] = [];
          const savedCart = localStorage.getItem('sneaker_cart');
          if (savedCart) {
            try {
              localCart = JSON.parse(savedCart);
            } catch (e) {
              console.error("Error parsing local cart:", e);
            }
          }

          set({
            user: null,
            favorites: [],
            cart: localCart,
            authLoading: false,
            _cartUnsubscribe: null,
            _favsUnsubscribe: null
          });
        }
      });

      return () => {
        unsubscribe();
        const { _cartUnsubscribe, _favsUnsubscribe } = get();
        if (_cartUnsubscribe) _cartUnsubscribe();
        if (_favsUnsubscribe) _favsUnsubscribe();
      };
    },

    addToCart: async (shoe) => {
      const { user, cart } = get();
      if (!user) {
        // Local-only state flow
        const existing = cart.find(item => item.id === shoe.id);
        let newCart: CartItem[];
        if (existing) {
          newCart = cart.map(item => item.id === shoe.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
          newCart = [...cart, { ...shoe, quantity: 1 }];
        }
        set({ cart: newCart });
        localStorage.setItem('sneaker_cart', JSON.stringify(newCart));
        return;
      }

      const itemRef = doc(db, 'users', user.uid, 'cart', shoe.id);
      const existing = cart.find(item => item.id === shoe.id);

      try {
        await setDoc(itemRef, {
          ...shoe,
          quantity: (existing?.quantity || 0) + 1,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/${shoe.id}`);
      }
    },

    removeFromCart: async (shoeId) => {
      const { user, cart } = get();
      if (!user) {
        const newCart = cart.filter(item => item.id !== shoeId);
        set({ cart: newCart });
        localStorage.setItem('sneaker_cart', JSON.stringify(newCart));
        return;
      }

      try {
        await deleteDoc(doc(db, 'users', user.uid, 'cart', shoeId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${shoeId}`);
      }
    },

    updateQuantity: async (shoeId, delta) => {
      const { user, cart, removeFromCart } = get();
      const item = cart.find(i => i.id === shoeId);
      if (!item) return;

      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        await removeFromCart(shoeId);
        return;
      }

      if (!user) {
        const newCart = cart.map(i => i.id === shoeId ? { ...i, quantity: newQuantity } : i);
        set({ cart: newCart });
        localStorage.setItem('sneaker_cart', JSON.stringify(newCart));
        return;
      }

      try {
        await setDoc(doc(db, 'users', user.uid, 'cart', shoeId), {
          quantity: newQuantity,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/cart/${shoeId}`);
      }
    },

    clearCart: async () => {
      const { user, cart, removeFromCart } = get();
      if (!user) {
        set({ cart: [] });
        localStorage.setItem('sneaker_cart', JSON.stringify([]));
        return;
      }

      for (const item of cart) {
        await removeFromCart(item.id);
      }
    },

    toggleFavorite: async (shoe) => {
      const { user, favorites } = get();
      if (!user) {
        window.dispatchEvent(new CustomEvent('toggle-auth'));
        return;
      }

      const favRef = doc(db, 'users', user.uid, 'favorites', shoe.id);
      if (favorites.includes(shoe.id)) {
        try {
          await deleteDoc(favRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/favorites/${shoe.id}`);
        }
      } else {
        try {
          await setDoc(favRef, {
            name: shoe.name,
            brand: shoe.brand,
            price: shoe.price,
            imageUrl: shoe.imageUrl,
            addedAt: new Date().toISOString()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/favorites/${shoe.id}`);
        }
      }
    }
  };
});

// Helper hooks for seamless retro-compatibility and clean modular exports
export function useCart() {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const clearCart = useStore(state => state.clearCart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
}

export function useAuth() {
  const user = useStore(state => state.user);
  const authLoading = useStore(state => state.authLoading);
  const favorites = useStore(state => state.favorites);
  const toggleFavorite = useStore(state => state.toggleFavorite);

  return {
    user,
    authLoading,
    favorites,
    toggleFavorite
  };
}

export function useTheme() {
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const initializeTheme = useStore(state => state.initializeTheme);

  return {
    theme,
    toggleTheme,
    initializeTheme
  };
}
