import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storeShoes, Shoe } from '../lib/data';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Tag, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import QuickViewModal from '../components/QuickViewModal';
import FilterSidebar from '../components/FilterSidebar';

export default function Offers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { products, isLoading } = useProducts();
  const [selectedQuickViewShoe, setSelectedQuickViewShoe] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const catFilter = queryParams.get('cat');

  const catNames: Record<string, string> = {
    'outlet': 'Outlet',
    'last-sizes': 'Últimas Tallas',
    'clearance': 'Liquidación'
  };

  const [filters, setFilters] = useState<{
    brand: string[];
    type: string[];
    priceRange: [number, number];
  }>({
    brand: [],
    type: [],
    priceRange: [0, 500]
  });

  const availableBrands = useMemo(() => Array.from(new Set(products.map(s => s.brand))), [products]);
  const availableTypes = useMemo(() => Array.from(new Set(products.map(s => s.type))), [products]);

  // Filter for offers (mock: shoes with price < 100)
  const filteredShoes = useMemo(() => {
    return products.filter(s => {
      const isOffer = s.price < 100;
      const brandMatch = filters.brand.length === 0 || filters.brand.includes(s.brand);
      const typeMatch = filters.type.length === 0 || filters.type.includes(s.type);
      const priceMatch = s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1];
      
      if (catFilter) {
        // In a real app we'd filter by category, here we just simulate
        return isOffer && brandMatch && typeMatch && priceMatch;
      }
      return isOffer && brandMatch && typeMatch && priceMatch;
    });
  }, [filters, catFilter, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 pt-12 pb-24 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase italic text-red-600 dark:text-red-500">
              Ofertas {catFilter && <span className="text-gray-400 dark:text-slate-500">/ {catNames[catFilter] || catFilter}</span>}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 max-w-2xl">Precios imbatibles en tus modelos favoritos. ¡Corre que vuelan!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-6 py-3 rounded-2xl font-black animate-pulse border border-red-100 dark:border-red-900/30">
              <Tag size={20} />
              HASTA 50% OFF
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <SlidersHorizontal size={18} className="text-blue-600" />
              Filtros
              {(filters.brand.length + filters.type.length + (filters.priceRange[1] < 500 ? 1 : 0)) > 0 && (
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {filters.brand.length + filters.type.length + (filters.priceRange[1] < 500 ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {filteredShoes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredShoes.map((shoe, index) => (
              <motion.div 
                key={shoe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${shoe.id}`)}
              >
                <div className="relative aspect-[4/5] bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden mb-4 border border-gray-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">-30%</div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuickViewShoe(shoe);
                        setIsQuickViewOpen(true);
                      }}
                      className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl text-gray-400 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={(e) => { e.stopPropagation(); addToCart(shoe); }} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors">
                      Añadir al carrito
                    </button>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{shoe.brand}</p>
                  <h3 className="font-bold text-xl mb-1 text-slate-800 dark:text-slate-100">{shoe.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-lg text-red-600 dark:text-red-400">${shoe.price}</p>
                    <p className="text-sm text-gray-400 dark:text-slate-500 line-through">${Math.round(shoe.price * 1.3)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-400 font-bold">No se encontraron productos con estos filtros.</p>
            <button 
              onClick={() => setFilters({ brand: [], type: [], priceRange: [0, 500] })}
              className="mt-4 text-blue-600 font-black uppercase tracking-widest text-xs"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <QuickViewModal 
        shoe={selectedQuickViewShoe}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <FilterSidebar 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableBrands={availableBrands}
        availableTypes={availableTypes}
      />
    </div>
  );
}
