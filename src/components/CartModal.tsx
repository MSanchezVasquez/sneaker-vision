import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-xl font-bold">Tu Carrito</h2>
                <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
                  {totalItems} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-800">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 dark:text-slate-100 leading-tight">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-md transition-all text-gray-600 dark:text-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-md transition-all text-gray-600 dark:text-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-black text-gray-900 dark:text-slate-100">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tu carrito está vacío</h3>
                    <p className="text-gray-500 text-sm">¡Agrega algunos sneakers para empezar!</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                  >
                    Seguir comprando
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Impuestos y envío calculados al finalizar la compra.
                </p>
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Finalizar Compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
