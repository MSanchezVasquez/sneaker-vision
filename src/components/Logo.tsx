import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Main Badge / Background */}
        <div className="absolute inset-0 bg-black rounded-xl overflow-hidden shadow-lg shadow-blue-900/10 rotate-3"></div>
        
        {/* Sneaker Icon (SVG) */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="absolute inset-0 w-full h-full p-1.5 -rotate-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M4 16L12 18L20 16L21 12L19 10L14 8L8 8L4 12L4 16Z" 
            fill="currentColor" 
            fillOpacity="0.2"
          />
          <path 
            d="M3.5 13.5L7.5 8.5L14.5 8.5L20.5 11.5L21.5 14L20.5 17.5L12 19L3.5 17.5V13.5Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
          {/* AI / Digital Lines */}
          <path 
            d="M10 11H15M11 13H14" 
            stroke="url(#ai-gradient)" 
            strokeWidth="1" 
            strokeLinecap="round" 
          />
          <defs>
            <linearGradient id="ai-gradient" x1="10" y1="12" x2="15" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tighter uppercase italic">
            Sneaker <span className="text-blue-600">IA</span>
          </span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">
            ZAPATERIA
          </span>
        </div>
      )}
    </div>
  );
};
