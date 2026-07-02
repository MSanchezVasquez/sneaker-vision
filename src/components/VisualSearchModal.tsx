import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search } from 'lucide-react';
import { Shoe } from '../lib/data';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualSearchModal({ isOpen, onClose }: VisualSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [results, setResults] = useState<Shoe[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setIsComparing(false);
    setResults([]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        
        // Simulate analysis time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsAnalyzing(false);
        setIsComparing(true);

        const res = await fetch('/api/visual-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            mimeType: file.type,
          }),
        });
        const data = await res.json();
        
        // Simulate comparison time
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (data.results) {
          setResults(data.results);
          setQuotaExceeded(!!data.quotaExceeded);
        }
      } catch (error) {
        console.error('Error searching similar shoes:', error);
      } finally {
        setIsAnalyzing(false);
        setIsComparing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetSearch = () => {
    setSelectedImage(null);
    setResults([]);
    setQuotaExceeded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isAnalyzing && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200"
              disabled={isAnalyzing || isComparing}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Search className="text-blue-600 dark:text-blue-400" />
              Busca por imagen
            </h2>

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                  isDragging 
                    ? 'border-blue-600 bg-blue-100/50 scale-[0.98]' 
                    : 'border-gray-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-4 rounded-full transition-colors mb-4 ${
                  isDragging ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'bg-gray-50 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                }`}>
                  <Upload size={32} />
                </div>
                <p className="font-medium text-gray-700 dark:text-slate-300">
                  {isDragging ? '¡Suelta la imagen aquí!' : 'Sube o arrastra una foto'}
                </p>
                <p className="text-sm text-gray-400 mt-1">Formatos: JPG, PNG, HEIC</p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-64 bg-gray-900 flex items-center justify-center">
                <img src={selectedImage} alt="Uploaded" className="h-full object-contain opacity-80" />
                
                {(isAnalyzing || isComparing) && (
                  <>
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6] z-10"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-medium z-20">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="bg-black/50 px-6 py-3 rounded-full backdrop-blur-md flex items-center gap-3 border border-white/20"
                      >
                        {isAnalyzing ? (
                          <>
                            <Camera size={20} className="animate-pulse text-blue-400" />
                            <span>Analizando modelo y textura...</span>
                          </>
                        ) : (
                          <>
                            <Search size={20} className="animate-spin text-blue-400" />
                            <span>Comparando resultados...</span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            )}

            {results.length > 0 && !isAnalyzing && !isComparing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8"
              >
                {quotaExceeded && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-400">
                    ⚠️ <strong>Límite de API alcanzado:</strong> Los créditos de prepago de Gemini están agotados o la API Key no está configurada. El sistema ha activado el motor de búsqueda y coincidencia inteligente de silueta local del catálogo.
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">Mejores coincidencias</h3>
                  <button onClick={resetSearch} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    Buscar otra
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {results.map((shoe, index) => (
                    <motion.div 
                      key={shoe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-100 dark:border-slate-800 rounded-2xl p-3 relative group cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all bg-white dark:bg-slate-900"
                    >
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                        {shoe.matchPercentage}% Match
                      </div>
                      <div className="aspect-square overflow-hidden rounded-xl mb-3">
                        <img 
                          src={shoe.imageUrl} 
                          alt={shoe.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="text-sm font-bold truncate">{shoe.name}</h4>
                      <p className="text-xs text-gray-500">{shoe.brand}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm font-bold text-blue-600">${shoe.price}</p>
                      </div>
                      {shoe.reason && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg line-clamp-2 leading-tight">
                          💡 {shoe.reason}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
