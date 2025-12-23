interface ToastProps {
  message: string;
  show: boolean;
}

export default function FavoriteToast({ message, show }: ToastProps) {
  if (!show) return null;
 
  return (
    // Ekranın üst-ortasına sabitlenmiş, animasyonlu bildirim
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
      <div className="flex items-center gap-2 bg-gray-900 text-white py-2 px-4 rounded-full shadow-lg">
        {/* Küçük kalp ikonu */}
        <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.318a4.5 4.5 0 010-6.364z" />
        </svg>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );  
} 