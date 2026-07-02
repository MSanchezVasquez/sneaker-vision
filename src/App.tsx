import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Offers from "./pages/Offers";
import Admin from "./pages/Admin";
import CartModal from "./components/CartModal";
import AuthModal from "./components/AuthModal";
import { useStore } from "./store/useStore";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // Initialize central authentication, Firestore sync listeners, and theme setting
    const unsubscribe = useStore.getState().initializeAuth();
    useStore.getState().initializeTheme();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleToggleCart = () => setIsCartOpen((prev) => !prev);
    const handleToggleAuth = () => setIsAuthOpen((prev) => !prev);
    window.addEventListener("toggle-cart", handleToggleCart);
    window.addEventListener("toggle-auth", handleToggleAuth);
    return () => {
      window.removeEventListener("toggle-cart", handleToggleCart);
      window.removeEventListener("toggle-auth", handleToggleAuth);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 mt-24 py-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
                  <ShoppingBag className="text-white dark:text-black w-4 h-4" />
                </div>
                <span className="text-lg font-bold tracking-tighter uppercase dark:text-white">
                  Sneaker
                  <span className="text-blue-600 dark:text-blue-400">
                    Vision
                  </span>
                </span>
              </div>
              <div className="flex gap-8 text-sm text-gray-500 dark:text-slate-400">
                <a
                  href="#"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Privacidad
                </a>
                <a
                  href="#"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Términos
                </a>
                <a
                  href="#"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Contacto
                </a>
              </div>
              <p className="text-sm text-gray-400 dark:text-slate-500">
                © 2024 SneakerVision. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
