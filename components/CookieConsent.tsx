'use client';

import { useState, useEffect } from 'react';

// --- İKONLAR ---
const CookieIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
    <path d="M8.5 8.5v.01" />
    <path d="M16 15.5v.01" />
    <path d="M12 12v.01" />
    <path d="M11 17v.01" />
    <path d="M7 14v.01" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-400 hover:text-white transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDetails, setShowDetails] = useState(false); 

  useEffect(() => {
    // NOT: Normalde burada localStorage kontrolü yapardık.
    // Ama sen her açılışta görmek istediğin için kontrolü kaldırdık.
    // Artık sayfa her yenilendiğinde 1 saniye sonra bu kutu çıkacak.
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (decision: 'accepted' | 'rejected') => {
    setIsClosing(true);
    setTimeout(() => {
      // Tercihi yine de kaydediyoruz (İleride mantığı değiştirmek istersen diye)
      localStorage.setItem('cookie_consent', decision);
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-6 left-6 z-[200] max-w-[400px] w-[calc(100%-48px)]
        transition-all duration-500 ease-out transform
        ${isClosing ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
    >
      <div className="bg-[#09090b]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl shadow-black/50 relative overflow-hidden min-h-[200px]">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        {/* --- GÖRÜNÜM 1: ANA EKRAN --- */}
        {!showDetails ? (
          <div className="animate-fade-in-down">
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="p-2 bg-white/5 rounded-full border border-white/10">
                <CookieIcon />
              </div>
              <h3 className="font-bold text-white text-lg tracking-tight">Çerez Tercihleri</h3>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-6 relative z-10">
              Size en iyi deneyimi sunmak için çerezleri kullanıyoruz. Veri politikamız hakkında daha fazla bilgi almak için 
              <button 
                onClick={() => setShowDetails(true)}
                className="text-white font-medium underline decoration-zinc-600 underline-offset-4 hover:decoration-white ml-1 transition-all focus:outline-none"
              >
                inceleyebilirsiniz.
              </button>
            </p>

            <div className="flex flex-col gap-3 relative z-10">
              <button
                onClick={() => handleClose('accepted')}
                className="w-full bg-white text-black text-sm font-bold py-3.5 px-4 rounded-xl hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                Tüm çerezleri kabul et
              </button>

              <button
                onClick={() => handleClose('rejected')}
                className="w-full bg-transparent text-zinc-300 hover:text-white text-sm font-medium py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
              >
                Tüm çerezleri reddet
              </button>
            </div>
          </div>
        ) : (
          /* --- GÖRÜNÜM 2: DETAY/POLİTİKA EKRANI --- */
          <div className="animate-fade-in-down h-full flex flex-col">
            
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <button 
                onClick={() => setShowDetails(false)}
                className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeftIcon />
              </button>
              <h3 className="font-bold text-white text-base">Çerez Politikası</h3>
            </div>

            <div className="text-xs text-zinc-400 space-y-4 leading-relaxed h-[220px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              <div>
                <h4 className="text-white font-semibold mb-1 text-sm">1. Zorunlu Çerezler</h4>
                <p>Bu çerezler, web sitesinin düzgün çalışması için gereklidir ve sistemlerimizde kapatılamaz. Genellikle yalnızca sizin tarafınızdan yapılan işlemlere yanıt olarak ayarlanır.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1 text-sm">2. Performans Çerezleri</h4>
                <p>Bu çerezler, sitemizin performansını ölçebilmemiz ve iyileştirebilmemiz için ziyaretleri ve trafik kaynaklarını saymamıza olanak tanır.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1 text-sm">3. Hedefleme Çerezleri</h4>
                <p>Bu çerezler, reklam ortaklarımız tarafından sitemiz üzerinden ayarlanabilir. İlgi alanlarınızın profilini oluşturmak için kullanılabilirler.</p>
              </div>
            </div>

            <div className="pt-4 mt-auto border-t border-white/10">
               <button
                onClick={() => handleClose('accepted')}
                className="w-full bg-white text-black text-sm font-bold py-3 px-4 rounded-xl hover:bg-zinc-200 transition-all duration-200 active:scale-[0.98]"
              >
                Anladım ve Kabul Ediyorum
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => handleClose('rejected')}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <CloseIcon />
        </button>

      </div>
    </div>
  );
}