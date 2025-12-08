// components/CameraIcon.tsx
import React from 'react';

export default function CameraIcon() {
  return (
    // Bu SVG ikonu, bir kamera ve üzerinde flaş sembolü içerir.
    // Daha modern ve sade bir çizgi ikonudur.
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4 text-gray-500" // Boyut ve rengi ayarla
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Kamera gövdesi */}
      <path d="M14.5 13.5l-4 4-4-4" />
      <path d="M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      {/* Lens */}
      <circle cx="12" cy="12" r="3" />
      {/* Flaş sembolü */}
      <path d="M17 6h.01" /> {/* Küçük bir nokta flaş */}
    </svg>
  );
}