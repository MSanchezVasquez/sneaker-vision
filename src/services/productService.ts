import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Shoe } from '../lib/data';

const COLLECTION_NAME = 'products';

export const productService = {
  async getAllProducts(): Promise<Shoe[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Shoe));
  },

  async getProductById(id: string): Promise<Shoe | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Shoe;
    }
    return null;
  },

  async getProductsByType(type: string): Promise<Shoe[]> {
    const q = query(collection(db, COLLECTION_NAME), where('type', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Shoe));
  },

  async seedProducts(shoes: Shoe[]) {
    // Check if collection is empty before seeding
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (snapshot.empty) {
      console.log('Seeding products to Firestore...');
      for (const shoe of shoes) {
        const docRef = doc(db, COLLECTION_NAME, shoe.id);
        await setDoc(docRef, {
          ...shoe,
          createdAt: serverTimestamp()
        });
      }
      console.log('Seeding complete.');
    }
  }
};
