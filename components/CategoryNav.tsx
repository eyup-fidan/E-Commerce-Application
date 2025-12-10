'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';

// Hamburger İkonu
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function CategoryNav() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm -mt-4 -mx-4 mb-6" ref={dropdownRef}>
      
      <div className="max-w-6xl mx-auto px-4 h-10 relative flex items-center">
        
        {/* SABİT TÜM KATEGORİLER BUTONU */}
        <div className="flex-shrink-0 mr-4 border-r border-gray-200 pr-4 h-6 flex items-center">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                    flex items-center gap-2 text-sm font-bold tracking-tight hover:text-orange-600 transition-colors
                    ${isDropdownOpen ? 'text-orange-600' : 'text-gray-800'}
                `}
            >
                <HamburgerIcon />
                TÜM KATEGORİLER
            </button>
        </div>

        {/* YATAY KAYDIRILABİLİR LİSTE */}
        <div className="flex-grow relative overflow-hidden h-full">
             {/* Sol Fade */}
            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            
            <ul className="flex items-center gap-6 overflow-x-auto h-full px-2 scrollbar-hide-custom">
            {CATEGORIES.map((category) => {
                const href = `/category/${category.slug}`;
                const isActive = pathname === href;
                return (
                <li key={category.slug} className="flex-shrink-0 h-full flex items-center">
                    <Link 
                    href={href}
                    className={`
                        text-sm font-semibold transition-colors duration-200 h-full flex items-center border-b-2 px-1
                        ${isActive 
                        ? 'text-orange-600 border-orange-600' 
                        : 'text-gray-700 border-transparent hover:text-orange-600'
                        }
                    `}
                    >
                    {category.name}
                    </Link>
                </li>
                );
            })}
            </ul>

            {/* Sağ Fade */}
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* AÇILIR MENÜ */}
        {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-b-xl shadow-xl border border-gray-100 border-t-0 z-50 overflow-hidden animate-fade-in-down">
                <div className="py-2">
                    {CATEGORIES.map((category) => (
                        <Link 
                            key={category.slug} 
                            href={`/category/${category.slug}`}
                            onClick={handleLinkClick}
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0 group"
                        >
                            <span className="font-medium">{category.name}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRightIcon />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </nav>
  );
}