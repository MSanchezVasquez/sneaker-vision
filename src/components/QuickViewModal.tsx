import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Check, ArrowRight } from 'lucide-react';
import { Shoe } from '../lib/data';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  shoe: Shoe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ shoe, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (shoe) {
      setActiveImage(shoe.imageUrl);
      if (shoe.sizes && shoe.sizes.length > 0) setSelectedSize(shoe.sizes[0]);
      if (shoe.colors && shoe.colors.length > 0) setSelectedColor(shoe.colors[0].name);
    }
  }, [shoe]);

  if (!shoe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] text-slate-900 dark:text-slate-100 transition-colors duration-300"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors z-10 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-slate-800 p-6 sm:p-8 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={activeImage} 
                  alt={shoe.name} 
                  className="max-w-full max-h-[400px] object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {shoe.gallery && shoe.gallery.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide justify-center">
                  {shoe.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-blue-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 overflow-y-auto bg-white dark:bg-slate-900">
              <div className="mb-6">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{shoe.brand}</p>
                <h2 className="text-3xl font-black tracking-tighter mb-2 leading-tight uppercase text-slate-900 dark:text-slate-100">
                  {shoe.name}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-900 dark:text-slate-100">${shoe.price}</span>
                  {shoe.isNew && (
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      NUEVO
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              {shoe.colors && (
                <div className="mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-400">Color: <span className="text-black dark:text-white">{selectedColor}</span></h3>
                  <div className="flex gap-3">
                    {shoe.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color.name ? 'border-blue-600 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor === color.name && (
                          <Check size={14} className={color.hex === '#ffffff' ? 'text-black' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {shoe.sizes && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-gray-400">Talla (EU)</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {shoe.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                          selectedSize === size 
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                            : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-300 border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    addToCart(shoe);
                    onClose();
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Añadir al Carrito
                </button>
                <button 
                  onClick={() => {
                    navigate(`/product/${shoe.id}`);
                    onClose();
                  }}
                  className="w-full bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-gray-100 dark:border-slate-800 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                >
                  Ver detalles completos
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
