interface HeartIconProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void; // Tıklama olayını alacak
}

export default function HeartIcon({ isFavorite, onClick }: HeartIconProps) {
  return (
    
    
    <div
      onClick={onClick}
      className={`
        flex items-center justify-center 
        w-9 h-9 
        rounded-full 
        bg-white 
        shadow-md 
        cursor-pointer
        transition-all duration-200 ease-in-out
        hover:scale-110 hover:bg-gray-50 
        active:scale-95
      `}
      aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
    >
      
      <svg 
        className={`
          w-5 h-5 
          stroke-2 
          transition-all duration-200
          ${isFavorite 
            ? 'fill-red-500 stroke-red-600' // Favori ise: Kırmızı ve dolu
            : 'fill-none stroke-gray-700'  // Favori değilse: Boş 
          }
        `}
        viewBox="0 0 24 24" 
        stroke="currentColor" 
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.318a4.5 4.5 0 010-6.364z" 
        />
      </svg>
    </div>
  );
}