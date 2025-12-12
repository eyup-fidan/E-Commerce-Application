interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

// Uyarı ikonu bileşeni
function WarningIcon() {
  return (
    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
 
export default function DeleteToast({ isOpen, onClose, onConfirm, productName }: ToastProps) {
  if (!isOpen) return null;

  return (
    // Ekranın alt-ortasına sabitlenmiş, gölgeli ve animasyonlu ana kutu
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-slide-in-up">
      <div className="bg-white rounded-lg shadow-2xl p-4 mx-4 flex items-start gap-4">
        {/* Sol Taraf: İkon */}
        <div className="flex-shrink-0">
          <WarningIcon />
        </div>
        
        {/* Orta Kısım: Metinler */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">Ürünü Sil</h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{productName}</span> adlı ürünü silmek istediğinizden emin misiniz?
          </p>
        </div>
        
        {/* Sağ Taraf: Butonlar */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={onConfirm}
            className="py-1 px-3 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Evet, Sil
          </button>
          <button
            onClick={onClose}
            className="py-1 px-3 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}