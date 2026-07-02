import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface SubCategory {
  name: string;
  path: string;
}

interface NavDropdownProps {
  title: string;
  mainPath: string;
  subCategories: SubCategory[];
}

export default function NavDropdown({ title, mainPath, subCategories }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        to={mainPath} 
        className={`flex items-center gap-1 hover:text-black transition-colors h-full ${isOpen ? 'text-black' : ''}`}
      >
        {title}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-0 w-48 bg-white rounded-b-2xl shadow-2xl border-x border-b border-gray-100 overflow-hidden z-50 py-2"
          >
            {subCategories.map((sub) => (
              <Link
                key={sub.name}
                to={sub.path}
                className="block px-6 py-3 text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all font-medium"
              >
                {sub.name}
              </Link>
            ))}
            <div className="border-t border-gray-50 mt-2 pt-2 px-6 pb-2">
              <Link 
                to={mainPath} 
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Ver todo {title}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
