import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShoppingBag, Heart, Search, Check, X, Eye, Loader2, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storeShoes, Shoe } from '../lib/data';
import { useProducts } from '../hooks/useProducts';
import VisualSearchModal from '../components/VisualSearchModal';
import QuickViewModal from '../components/QuickViewModal';
import FilterSidebar from '../components/FilterSidebar';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../store/useStore';

const BRANDS = ['Nike', 'Adidas', 'Vans', 'Jordan', 'On', 'Reebok'];
const TYPES = ['Running', 'Lifestyle', 'Basketball', 'Skate'];
const PRICE_RANGES = [
  { label: 'Menos de $100', min: 0, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: 'Más de $150', min: 150, max: 1000 },
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, isLoading } = useProducts();
  const { favorites, toggleFavorite: storeToggleFavorite } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuickViewShoe, setSelectedQuickViewShoe] = useState<Shoe | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const novedadesRef = React.useRef<HTMLElement>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number; label: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShoes = useMemo(() => {
    return products.filter((shoe) => {
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(shoe.brand);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(shoe.type);
      const priceMatch = !selectedPriceRange || (shoe.price >= selectedPriceRange.min && shoe.price <= selectedPriceRange.max);
      const searchMatch = searchQuery === '' || 
        shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        shoe.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return brandMatch && typeMatch && priceMatch && searchMatch;
    });
  }, [selectedBrands, selectedTypes, selectedPriceRange, searchQuery, products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => 
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleMobileFilterChange = (newFilters: any) => {
    setSelectedBrands(newFilters.brand);
    setSelectedTypes(newFilters.type);
    setSelectedPriceRange(newFilters.priceRange[1] < 500 ? { min: 0, max: newFilters.priceRange[1], label: `Hasta $${newFilters.priceRange[1]}` } : null);
  };

  const toggleFavorite = async (e: React.MouseEvent, shoe: any) => {
    e.stopPropagation();
    await storeToggleFavorite(shoe);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 text-[#1A1A1A] dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          {/* Animated Accents */}
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ 
                hidden: { opacity: 0 }, 
                visible: { 
                  opacity: 1, 
                  transition: { 
                    staggerChildren: 0.15,
                    delayChildren: 0.3
                  } 
                } 
              }}
            >
              <motion.div 
                variants={{ 
                  hidden: { opacity: 0, x: -30 }, 
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.8, ease: "easeOut" }
                  } 
                }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-12 bg-blue-500"></span>
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
                  Nueva Colección 2024
                </span>
              </motion.div>

              <motion.h1 
                variants={{ 
                  hidden: { opacity: 0, y: 60, skewY: 2 }, 
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    skewY: 0,
                    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
                  } 
                }} 
                className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] sm:leading-[0.8] text-white mb-8"
              >
                ENCUENTRA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  TU ESTILO.
                </span>
              </motion.h1>

              <motion.p 
                variants={{ 
                  hidden: { opacity: 0, y: 30 }, 
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
                  } 
                }} 
                className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed font-medium"
              >
                ¿Viste unas zapatillas increíbles? Tómales una foto y nuestra <span className="text-white font-bold">IA de vanguardia</span> encontrará el modelo exacto en segundos.
              </motion.p>

              <motion.div 
                variants={{ 
                  hidden: { opacity: 0, y: 20 }, 
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut" }
                  } 
                }} 
                className="flex flex-col sm:flex-row gap-5"
              >
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setIsModalOpen(true)} 
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all group"
                >
                  <Camera size={24} className="group-hover:rotate-12 transition-transform" />
                  Búsqueda Visual IA
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }} 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all"
                >
                  Explorar Catálogo
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Novedades Section */}
      <section ref={novedadesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-3 block">Lo más reciente</span>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">NOVEDADES</h2>
          </div>
          <button className="text-sm font-bold border-b-2 border-black dark:border-white pb-1 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
            Ver todo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(s => s.isNew).map((shoe, index) => (
            <motion.div
              key={`new-${shoe.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${shoe.id}`)}
            >
              <div className="relative aspect-square bg-white dark:bg-slate-900 rounded-3xl overflow-hidden mb-4 border border-gray-100 dark:border-slate-800 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">NUEVO</div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuickViewShoe(shoe);
                      setIsQuickViewOpen(true);
                    }}
                    className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-gray-400 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Eye size={18} />
                  </button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(shoe); }} className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md text-black dark:text-white py-3 rounded-xl font-bold text-xs shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">
                  Añadir al carrito
                </button>
              </div>
              <div className="px-2">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{shoe.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-500 dark:text-slate-400 text-sm">{shoe.brand}</p>
                  <span className="font-black text-slate-900 dark:text-slate-100">${shoe.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Logos Carousel */}
      <section className="bg-white dark:bg-slate-900 py-16 border-y border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h3 className="text-center text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">Nuestras Marcas Aliadas</h3>
        </div>
        
        <div className="relative">
          <motion.div 
            animate={{ x: [0, -1500] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 sm:gap-32 items-center whitespace-nowrap px-12"
          >
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => {
              const logos: Record<string, string> = {
                'Nike': 'https://www.vectorlogo.zone/logos/nike/nike-ar21.svg',
                'Adidas': 'https://www.vectorlogo.zone/logos/adidas/adidas-ar21.svg',
                'Vans': 'https://www.vectorlogo.zone/logos/vans/vans-ar21.svg',
                'Jordan': 'https://www.vectorlogo.zone/logos/jordan/jordan-ar21.svg',
                'On': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/On-running-logo.svg',
                'Reebok': 'https://www.vectorlogo.zone/logos/reebok/reebok-ar21.svg'
              };

              return (
                <button
                  key={`${brand}-${idx}`}
                  onClick={() => {
                    setSelectedBrands(prev => prev.includes(brand) ? prev : [brand]);
                    novedadesRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group transition-all hover:scale-110 active:scale-95 flex items-center shrink-0 ${
                    selectedBrands.includes(brand) ? 'opacity-100' : 'opacity-30 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={logos[brand] || ''} 
                    alt={brand} 
                    className={`h-8 sm:h-12 w-auto object-contain grayscale brightness-50 dark:invert dark:brightness-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:dark:invert-0 transition-all ${
                      selectedBrands.includes(brand) ? 'grayscale-0 brightness-100 dark:invert-0' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}
          </motion.div>
          
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F9F9F9] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F9F9F9] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* Main Content with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between gap-4 mb-2">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 py-4 rounded-2xl font-bold shadow-sm text-slate-800 dark:text-slate-100"
            >
              <SlidersHorizontal size={18} />
              Filtros
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 py-4 pl-12 pr-4 rounded-2xl font-bold shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-slate-100 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <aside className="hidden lg:block w-64 flex-shrink-0 text-slate-800 dark:text-slate-100">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-slate-100">Marcas</h3>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => toggleBrand(brand)} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-700 group-hover:border-blue-400'}`}>
                        {selectedBrands.includes(brand) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${selectedBrands.includes(brand) ? 'font-bold text-black dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-slate-100">Tipo de Calzado</h3>
                <div className="space-y-2">
                  {TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => toggleType(type)} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-700 group-hover:border-blue-400'}`}>
                        {selectedTypes.includes(type) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${selectedTypes.includes(type) ? 'font-bold text-black dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-slate-100">Rango de Precio</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => setSelectedPriceRange(selectedPriceRange?.label === range.label ? null : range)} className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedPriceRange?.label === range.label ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-700 group-hover:border-blue-400'}`}>
                        {selectedPriceRange?.label === range.label && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-sm ${selectedPriceRange?.label === range.label ? 'font-bold text-black dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredShoes.map((shoe) => (
                <motion.div key={shoe.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group cursor-pointer" onClick={() => navigate(`/product/${shoe.id}`)}>
                  <div className="relative aspect-[4/5] bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden mb-4 border border-gray-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                      <button 
                        onClick={(e) => toggleFavorite(e, shoe)} 
                        className={`p-3 rounded-2xl backdrop-blur-md transition-all ${favorites.includes(shoe.id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 dark:bg-slate-900/80 text-gray-400 dark:text-slate-300 hover:text-red-500 shadow-sm'}`}
                      >
                        <Heart size={18} className={favorites.includes(shoe.id) ? "fill-current" : ""} />
                      </button>
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
                      <button onClick={(e) => { e.stopPropagation(); addToCart(shoe); }} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-600 transition-colors">
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{shoe.brand}</p>
                    <h3 className="font-bold text-xl mb-1 text-slate-800 dark:text-slate-100">{shoe.name}</h3>
                    <p className="font-black text-lg text-slate-900 dark:text-slate-100">${shoe.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VisualSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <QuickViewModal 
        shoe={selectedQuickViewShoe}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
      <FilterSidebar 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        availableBrands={BRANDS}
        availableTypes={TYPES}
        filters={{
          brand: selectedBrands,
          type: selectedTypes,
          priceRange: [0, selectedPriceRange ? selectedPriceRange.max : 500]
        }}
        setFilters={(updateAction: any) => {
          // This is a bit tricky because setFilters in FilterSidebar expects an object setter
          // But here we have individual states. This is a quick bridge.
          const currentFilters = {
            brand: selectedBrands,
            type: selectedTypes,
            priceRange: [0, selectedPriceRange ? selectedPriceRange.max : 500] as [number, number]
          };
          const nextFilters = typeof updateAction === 'function' ? updateAction(currentFilters) : updateAction;
          handleMobileFilterChange(nextFilters);
          return nextFilters;
        }}
      />
    </div>
  );
}
