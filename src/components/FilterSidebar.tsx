import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    brand: string[];
    type: string[];
    priceRange: [number, number];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    brand: string[];
    type: string[];
    priceRange: [number, number];
  }>>;
  availableBrands: string[];
  availableTypes: string[];
}

export default function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters, 
  availableBrands, 
  availableTypes 
}: FilterSidebarProps) {
  
  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand.includes(brand) 
        ? prev.brand.filter(b => b !== brand) 
        : [...prev.brand, brand]
    }));
  };

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type) 
        ? prev.type.filter(t => t !== type) 
        : [...prev.type, type]
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: [0, value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: [],
      type: [],
      priceRange: [0, 500]
    });
  };

  const activeCount = filters.brand.length + filters.type.length + (filters.priceRange[1] < 500 ? 1 : 0);

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col lg:hidden text-slate-900 dark:text-slate-100 transition-colors duration-300"
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-black tracking-tight">FILTROS</h2>
                {activeCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               {/* Brands */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Marcas</h3>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        filters.brand.includes(brand)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg shadow-black/20 dark:shadow-white/5'
                          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-300 border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Categoría</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        filters.type.includes(type)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-300 border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Precio Máximo</h3>
                  <span className="text-sm font-black text-blue-600">${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <button
                onClick={clearFilters}
                className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={onClose}
                className="bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-xl shadow-black/10"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
