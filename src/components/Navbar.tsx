import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, X, Menu, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import { useAuth, useTheme } from '../store/useStore';
import { storeShoes } from '../lib/data';
import { useProducts } from '../hooks/useProducts';
import NavDropdown from './NavDropdown';

import { Logo } from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems, cart, totalPrice } = useCart();
  const { products } = useProducts();
  const { user, favorites } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMiniCartVisible, setIsMiniCartVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = {
    men: [
      { name: 'Running', path: '/men?type=Running' },
      { name: 'Lifestyle', path: '/men?type=Lifestyle' },
      { name: 'Basketball', path: '/men?type=Basketball' },
      { name: 'Skate', path: '/men?type=Skate' },
    ],
    women: [
      { name: 'Running', path: '/women?type=Running' },
      { name: 'Lifestyle', path: '/women?type=Lifestyle' },
      { name: 'Skate', path: '/women?type=Skate' },
    ],
    offers: [
      { name: 'Outlet', path: '/offers?cat=outlet' },
      { name: 'Últimas Tallas', path: '/offers?cat=last-sizes' },
      { name: 'Liquidación', path: '/offers?cat=clearance' },
    ]
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const searchSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return products
      .filter(shoe => 
        shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shoe.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-slate-400 h-full">
              <Link to="/catalog" className="hover:text-black dark:hover:text-white transition-colors">Catálogo</Link>
              <NavDropdown title="Hombre" mainPath="/men" subCategories={categories.men} />
              <NavDropdown title="Mujer" mainPath="/women" subCategories={categories.women} />
              <NavDropdown title="Ofertas" mainPath="/offers" subCategories={categories.offers} />
              <Link to="/admin" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 transition-colors">Panel Admin</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <div className={`flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-full transition-all ${isSearchFocused ? 'ring-2 ring-blue-500 bg-white dark:bg-slate-900 w-64' : 'w-48'}`}>
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar sneakers..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-slate-200 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-black dark:hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isSearchFocused && searchSuggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50"
                  >
                    {searchSuggestions.map((shoe) => (
                      <button
                        key={shoe.id}
                        onClick={() => {
                          navigate(`/product/${shoe.id}`);
                          setSearchQuery('');
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <img src={shoe.imageUrl} alt={shoe.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 dark:bg-slate-800" />
                        <div>
                          <p className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-200">{shoe.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{shoe.brand}</p>
                        </div>
                        <span className="ml-auto text-xs font-bold text-blue-600 dark:text-blue-400">${shoe.price}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsSearchFocused(true)}
              className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            {user && (
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors relative">
                <Heart size={20} className={favorites.length > 0 ? "fill-red-500 text-red-500" : ""} />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                )}
              </button>
            )}
            <div 
              className="relative"
              onMouseEnter={() => setIsMiniCartVisible(true)}
              onMouseLeave={() => setIsMiniCartVisible(false)}
            >
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors relative"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                    {totalItems}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isMiniCartVisible && totalItems > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Tu Carrito</h3>
                      <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{totalItems} items</span>
                    </div>
                    
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
                      {cart.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50 dark:bg-slate-800" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{item.name}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">{item.brand} • Cant: {item.quantity}</p>
                          </div>
                          <p className="text-xs font-black text-slate-900 dark:text-slate-100">${item.price * item.quantity}</p>
                        </div>
                      ))}
                      {cart.length > 3 && (
                        <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 font-bold py-1">
                          + {cart.length - 3} productos más
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-50 dark:border-slate-800 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">${totalPrice}</span>
                      </div>
                      <button 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('toggle-cart'));
                          setIsMiniCartVisible(false);
                        }}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-black text-xs hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors shadow-lg"
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold truncate max-w-[100px] text-slate-800 dark:text-slate-100">{user.displayName || user.email}</p>
                  <button onClick={handleLogout} className="text-[10px] text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Cerrar sesión</button>
                </div>
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`} alt="User" className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-800" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors flex items-center gap-2"
              >
                <User size={20} />
                <span className="text-xs font-bold hidden sm:block text-gray-700 dark:text-gray-300">
                  Ingresar
                </span>
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-50 bg-white p-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl">
                <Search size={20} className="text-gray-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Buscar sneakers..." 
                  className="bg-transparent border-none outline-none text-base w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400">
                    <X size={18} />
                  </button>
                )}
              </div>
              <button 
                onClick={() => setIsSearchFocused(false)}
                className="text-sm font-bold text-blue-600"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-4">
              {searchSuggestions.map((shoe) => (
                <button
                  key={shoe.id}
                  onClick={() => {
                    navigate(`/product/${shoe.id}`);
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="w-full flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <img src={shoe.imageUrl} alt={shoe.name} className="w-16 h-16 object-cover rounded-xl bg-gray-100" />
                  <div>
                    <p className="font-bold">{shoe.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{shoe.brand} • ${shoe.price}</p>
                  </div>
                </button>
              ))}
              {searchQuery.length >= 2 && searchSuggestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 italic">No encontramos resultados para "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <Logo size={28} />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-6">
                <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="block text-4xl font-black tracking-tighter flex items-center justify-between">
                  CATÁLOGO
                  <ShoppingBag size={24} className="text-gray-300" />
                </Link>
                <div className="h-px bg-gray-100" />
                
                <div className="space-y-4">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Categorías</p>
                  <div className="grid grid-cols-1 gap-4">
                    <Link to="/men" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold">Hombre</Link>
                    <Link to="/women" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold">Mujer</Link>
                    <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-red-500">Ofertas</Link>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</Link>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Tu Cuenta</p>
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-full border border-white shadow-sm" />
                      <div>
                        <p className="font-bold">{user.displayName || user.email}</p>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-xs text-red-500 font-bold">Cerrar sesión</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('toggle-auth')); setIsMobileMenuOpen(false); }}
                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg shadow-xl"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <p className="text-sm font-black">${totalPrice}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Total Carrito</p>
                </div>
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('toggle-cart')); setIsMobileMenuOpen(false); }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm"
                >
                  Ver Carrito
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
