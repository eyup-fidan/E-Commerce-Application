import Link from 'next/link';
import { Product } from '@/types';
import HeartIcon from './HeartIcon';
import { formatPriceWithoutSymbol } from '@/lib/format';
import PencilIcon from './PencilIcon';
import TrashIcon from './TrashIcon';

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
  isFavorite: boolean; 
  onToggleFavorite: (e: React.MouseEvent) => void;
}

// YILDIZ BİLEŞENİ
const Star = ({ percentage, idPrefix }: { percentage: number; idPrefix: string }) => {
  const gradientId = `grad-${idPrefix}`;
 
  return (
    <svg 
      className="w-4 h-4" 
      viewBox="0 0 24 24" 
      // Yıldızın sınırlarını belli etmek için ince bir çerçeve 
      stroke="#9CA3AF" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {/* Dolu Kısım (Sarı - #FBBF24) */}
          <stop offset={`${percentage}%`} stopColor="#FBBF24" stopOpacity="1" />
          {/* Boş Kısım (Daha Koyu Gri - #D1D5DB) - Kontrast için koyulaştırdık */}
          <stop offset={`${percentage}%`} stopColor="#D1D5DB" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Yıldız Şekli */}
      <path
        fill={`url(#${gradientId})`}
        // Stroke'un üzerine binmemesi için fill-rule ekledik.
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
};

export default function ProductCard({ 
  product, 
  onDelete, 
  isFavorite, 
  onToggleFavorite 
}: ProductCardProps) {
    
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100) : 0;
  const rating = product.rating || 0;

  // Yıldızları hesaplayan fonksiyon
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // Matematiksel Hesaplama:
      let fill = Math.max(0, Math.min(100, (rating - (i - 1)) * 100));
      
      stars.push(
        <Star key={i} percentage={fill} idPrefix={`${product.id}-${i}`} />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 flex flex-col">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="w-full h-72 flex items-center justify-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <img
              src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/300'}
              alt={product.name || 'Ürün Resmi'}
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            %{discountPercentage} İNDİRİM
          </span>
        )}
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon 
            isFavorite={isFavorite}
            onClick={onToggleFavorite}
          />
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 h-14 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate">
          {product.category}
        </p>
        <div className="flex items-baseline space-x-2">
          <p className={`font-bold ${hasDiscount ? 'text-red-500' : 'text-gray-900'} text-xl`}>
            {hasDiscount 
              ? formatPriceWithoutSymbol(product.discountedPrice!) 
              : formatPriceWithoutSymbol(product.price)}₺
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {formatPriceWithoutSymbol(product.price)}₺
            </p>
          )}
        </div>
        
        {/* YILDIZ ALANI */}
        {rating > 0 ? (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span> 
            <div className="flex gap-0.5"> {/* Yıldızlar arası çok az boşluk */}
              {renderStars()}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
            
            <span className="text-base translate-y-[-2px]" role="img" aria-label="fotoğraflı yorum">
              📸
            </span>
          </div>
        ) : ( 
          <div className="h-5 mt-2" /> 
        )}

        <div className="flex-grow"></div> 

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            Stok: <span className="font-bold text-gray-800">{product.stock}</span>
          </p>
          <div className="flex space-x-2">
            <Link 
              href={`/add-product?update=${product.id}`} 
              className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              aria-label="Ürünü güncelle"
            ><PencilIcon /></Link>
            <button 
              onClick={() => onDelete(product)} 
              className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              aria-label="Ürünü sil"
            ><TrashIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}