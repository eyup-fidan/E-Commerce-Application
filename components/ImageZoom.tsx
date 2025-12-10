'use client';

import { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number;
}

// Lensin boyutu sabit 
const LENS_WIDTH = 200; // Lensin genişliği
const LENS_HEIGHT = 200; // Lensin yüksekliği

export default function ImageZoom({ src, alt, zoomScale = 2.5 }: ImageZoomProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 }); // Lensin pozisyonu için yeni state

  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    // Fare pozisyonunu hesapla (sayfa kaydırma dahil)
    const mouseX = e.pageX - left - window.scrollX;
    const mouseY = e.pageY - top - window.scrollY;

    // Lensin pozisyonunu hesapla: Fareyi merkeze al ve resim dışına taşmasını engelle
    let newLensX = mouseX - LENS_WIDTH / 2;
    let newLensY = mouseY - LENS_HEIGHT / 2;

    // Lensin resim sınırları içinde kalmasını sağla 
    if (newLensX < 0) newLensX = 0;
    if (newLensY < 0) newLensY = 0;
    if (newLensX > width - LENS_WIDTH) newLensX = width - LENS_WIDTH;
    if (newLensY > height - LENS_HEIGHT) newLensY = height - LENS_HEIGHT;
    
    setLensPosition({ x: newLensX, y: newLensY });

    // Arka plan pozisyonunu lensin pozisyonuna göre ayarla 
    const bgPosX = (newLensX / (width - LENS_WIDTH)) * 100;
    const bgPosY = (newLensY / (height - LENS_HEIGHT)) * 100;

    setBackgroundPosition(`${bgPosX}% ${bgPosY}%`);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      {/* Ana Görsel */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-96 object-contain rounded-lg cursor-none" // İmleci gizle
        onMouseMove={handleMouseMove}
      />

      {/* Büyüteç (Lens) - Fareyi takip eden kare */}
      {showZoom && (
        <div
          className="
            absolute 
            border-2 border-blue-500 
            bg-white/30 
            pointer-events-none 
            hidden md:block 
            z-10
          "
          style={{
            width: `${LENS_WIDTH}px`,
            height: `${LENS_HEIGHT}px`,
            top: `${lensPosition.y}px`,
            left: `${lensPosition.x}px`,
            transform: 'translateZ(0)', // Performans için
          }}
        />
      )}

      {/* Büyütülmüş Zoom Paneli */}
      {showZoom && (
        <div 
          className="
            absolute left-full top-0 
            ml-4 
            w-[400px] h-[400px] 
            bg-gray-100 
            border-2 border-gray-300 
            rounded-lg shadow-xl 
            hidden md:block 
            pointer-events-none 
            transition-opacity duration-200 
            overflow-hidden // Taşan kısmı gizler
          "
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: backgroundPosition,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}