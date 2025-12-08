// components/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import HamburgerIcon from './HamburgerIcon';
import CloseIcon from './CloseIcon';
import HeaderHeartIcon from './HeaderHeartIcon';
import ShoppingCartIcon from './ShoppingCartIcon';
import PlusIconHeader from './PlusIconHeader';
import AuthModal from './AuthModal'; 
import { getCartItems } from '@/lib/storage'; // <-- ÖNEMLİ

// ... (İkonlar aynı) ...
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const [cartCount, setCartCount] = useState(0);

  const urlSearchTerm = searchParams.get('search') || '';
  const [localSearchTerm, setLocalSearchTerm] = useState(urlSearchTerm);

  // SEPET GÜNCELLEME MANTIĞI
  const updateCartCount = () => {
    const items = getCartItems();
    // Eğer items null veya undefined ise 0, değilse miktarları topla
    const total = items ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    setCartCount(total);
  };

  useEffect(() => {
    setLocalSearchTerm(urlSearchTerm);
    
    // Sayfa her değiştiğinde sepeti kontrol et (Navigasyon yapınca senkron kalsın)
    updateCartCount();
  }, [urlSearchTerm, pathname]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    // İlk açılışta sepeti kontrol et
    updateCartCount();

    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    // 'cartUpdated' olayını dinle
    window.addEventListener('cartUpdated', updateCartCount);
    // Tarayıcı depolama olayını dinle (başka sekmede değişirse)
    window.addEventListener('storage', updateCartCount);
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('cartUpdated', updateCartCount);
        window.removeEventListener('storage', updateCartCount);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (term: string) => {
    setLocalSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) { params.set('search', term); } else { params.delete('search'); }
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsUserDropdownOpen(false);
    window.location.href = "/"; 
  };

  const showSearchBar = 
    pathname === '/' || 
    pathname === '/favorites' || 
    pathname === '/cart' || 
    pathname === '/account' || 
    pathname.startsWith('/category/');

  const iconContainerClasses = `relative flex items-center justify-center p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200`;
  const activeIconClasses = "text-blue-600 bg-blue-50";
  const mobileLinkClasses = "flex items-center gap-3 w-full text-left px-4 py-3 text-lg rounded-md transition-colors duration-200";
  const mobileActiveLinkClasses = "bg-blue-100 text-blue-600 font-semibold";
  const mobileInactiveLinkClasses = "text-gray-700 hover:bg-blue-50";

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4 gap-4">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600" onClick={() => setIsMenuOpen(false)}>
              Ürün Yönetim Sistemi
            </Link>
          </div>

          {showSearchBar && (
            <div className="relative flex-grow max-w-lg mx-4 hidden md:block">
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={localSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          )}
          {!showSearchBar && <div className="flex-grow"></div>}

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            
            <div className="relative" ref={userDropdownRef}>
                {user ? (
                    <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                        <UserIcon /> <span className="max-w-[100px] truncate">{user.name}</span>
                    </button>
                ) : (
                    <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors group px-3 py-2">
                        <UserIcon />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[11px] font-normal text-gray-500 group-hover:text-orange-500">Giriş Yap</span>
                            <span className="text-[13px] text-gray-800 group-hover:text-orange-600">veya üye ol</span>
                        </div>
                    </button>
                )}
                {isUserDropdownOpen && user && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                        <div className="p-4 border-b border-gray-50 bg-gray-50">
                            <p className="text-xs text-gray-400 mb-1">Hoş geldin,</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{user.name} {user.surname}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2">
                            <Link href="/account" onClick={() => setIsUserDropdownOpen(false)} className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors flex items-center gap-2">
                                <SettingsIcon /> Kullanıcı Bilgileri
                            </Link>
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                                <LogoutIcon /> Çıkış Yap
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <Link href="/favorites" className={`${iconContainerClasses} ${pathname === '/favorites' ? activeIconClasses : ''}`} aria-label="Favorilerim">
              <HeaderHeartIcon />
            </Link>
            
            {/* SEPET İKONU VE SAYISI */}
            <Link href="/cart" className={`${iconContainerClasses} ${pathname === '/cart' ? activeIconClasses : ''}`} aria-label="Sepetim">
              <ShoppingCartIcon />
              {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-orange-600 rounded-full border-2 border-white shadow-sm transform scale-100 transition-transform">
                      {cartCount > 99 ? '99+' : cartCount}
                  </span>
              )}
            </Link>
            
            <Link href="/add-product" className={`${iconContainerClasses} ${pathname === '/add-product' ? activeIconClasses : ''}`} aria-label="Ürün Ekle">
              <PlusIconHeader />
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </nav>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white shadow-xl z-50">
             <div className="flex justify-between items-center p-4 border-b">
                <span className="text-lg font-bold text-blue-600">Menü</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100"><CloseIcon /></button>
             </div>
             <div className="p-4">
                 {user ? (
                     <div className="bg-gray-50 p-4 rounded-lg mb-4">
                         <p className="font-bold text-gray-800 mb-2">{user.name} {user.surname}</p>
                         <Link href="/account" onClick={() => setIsMenuOpen(false)} className="text-sm text-blue-600 underline block mb-2">Bilgilerimi Düzenle</Link>
                         <button onClick={handleLogout} className="text-sm text-red-600 font-bold">Çıkış Yap</button>
                     </div>
                 ) : (
                    <button onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold mb-4">Giriş Yap / Üye Ol</button>
                 )}
                 <div className="space-y-3">
                    {showSearchBar && (
                        <div className="relative mb-2">
                        <input type="text" placeholder="Ürün ara..." value={localSearchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-gray-100 border-none rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}
                    <Link href="/favorites" className="block text-lg text-gray-700">Favorilerim</Link>
                    <Link href="/cart" className="flex items-center justify-between text-lg text-gray-700">
                        <span>Sepetim</span>
                        {cartCount > 0 && <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold">{cartCount}</span>}
                    </Link>
                    <Link href="/add-product" className="block text-lg text-gray-700">Ürün Ekle</Link>
                 </div>
             </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={(u) => setUser(u)} />
    </>
  );
}