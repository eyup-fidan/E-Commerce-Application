'use client';

import { useState, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export default function Tooltip({ children, text }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 100); 
  };

  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {children}
      
      <div 
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-3
          transition-all duration-300 ease-in-out
          ${isVisible 
            ? 'opacity-100 translate-y-0'  
            
            : 'opacity-0 translate-y-2 pointer-events-none' 
          }
        `}
      >
        {/* Ana metin kutusu */}
        <div 
          className="w-max max-w-xs p-3 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl"
        >
          {text}
        </div>
         
        {/* OK - Üçgen kısmı */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45"
        />
      </div>
    </div>
  );
}