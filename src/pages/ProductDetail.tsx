import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Heart, Share2, Star, Check, Loader2 } from 'lucide-react';
import { storeShoes, Shoe } from '../lib/data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../store/useStore';
import { productService } from '../services/productService';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite: storeToggleFavorite } = useAuth();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [showShareToast, setShowShareToast] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const isFavorite = id ? favorites.includes(id) : false;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const foundShoe = await productService.getProductById(id);
        if (foundShoe) {
          setShoe(foundShoe);
          setActiveImage(foundShoe.imageUrl);
          if (foundShoe.sizes && foundShoe.sizes.length > 0) setSelectedSize(foundShoe.sizes[0]);
          if (foundShoe.colors && foundShoe.colors.length > 0) setSelectedColor(foundShoe.colors[0].name);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleShare = async () => {
    if (!shoe) return;
    
    const shareData = {
      title: `SneakerVision - ${shoe.name}`,
      text: `¡Mira estas increíbles ${shoe.name} de ${shoe.brand} en SneakerVision!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!shoe) return;
    await storeToggleFavorite(shoe);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className="text-2xl font-black mb-4">PRODUCTO NO ENCONTRADO</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-800 dark:text-slate-200"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-sm uppercase tracking-widest text-gray-400 dark:text-slate-500">{shoe.brand}</span>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={toggleFavorite}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 dark:text-slate-400'}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId={`image-${shoe.id}`}
              className="aspect-square bg-gray-50 dark:bg-slate-900 rounded-[40px] overflow-hidden border border-gray-100 dark:border-slate-800 relative cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  src={activeImage} 
                  alt={shoe.name} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? 'scale(2)' : 'scale(1)',
                    transition: 'transform 0.2s ease-out'
                  }}
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              {isZooming && (
                <div className="absolute inset-0 pointer-events-none border-4 border-blue-600/20 rounded-[40px]" />
              )}
            </motion.div>
            
            {shoe.gallery && shoe.gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {shoe.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-12 rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-50 dark:border-slate-800 transition-colors duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500">(128 reseñas)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-slate-100">
                {shoe.name?.toUpperCase() || ''}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">${shoe.price}</span>
                {shoe.isNew && (
                  <span className="bg-blue-600 text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full">
                    NUEVO LANZAMIENTO
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-10 text-base sm:text-lg">
              {shoe.description}
            </p>

            {/* Color Selection */}
            {shoe.colors && (
              <div className="mb-10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4 text-slate-900 dark:text-slate-100">Color: <span className="text-gray-400 dark:text-slate-400">{selectedColor}</span></h3>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  {shoe.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                        selectedColor === color.name ? 'border-blue-600 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <Check size={16} className={color.hex === '#ffffff' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {shoe.sizes && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">Talla (EU)</h3>
                  <button className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 underline">Guía de tallas</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3">
                  {shoe.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border-2 ${
                        selectedSize === size 
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl' 
                          : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-300 border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-auto flex gap-4">
              <button 
                onClick={() => addToCart(shoe)}
                className="flex-1 bg-blue-600 text-white py-5 sm:py-6 rounded-[20px] sm:rounded-[24px] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} />
                Añadir al Carrito
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
                  <Star size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500">Envío Gratis</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Pedidos +$100</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
                  <Star size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500">Garantía</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">30 días retorno</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-2xl z-50 flex items-center gap-2"
          >
            <Check size={18} className="text-green-400" />
            ¡Enlace copiado al portapapeles!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
