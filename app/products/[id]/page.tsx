'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// --- YENİ IMPORTLAR ---
import { getProductsFromStorage, addToCart } from '@/lib/storage';
import { Product, CartItem } from '@/types'; // <-- CartItem'ı import et
import Link from 'next/link';
import Notification from '@/components/Notification';
import MinusIcon from '@/components/MinusIcon'; 
import PlusIcon from '@/components/PlusIcon';
import ChevronLeftIcon from '@/components/ChevronLeftIcon';
import ChevronRightIcon from '@/components/ChevronRightIcon';
import { formatPriceWithoutSymbol } from '@/lib/format';
import ImageZoom from '@/components/ImageZoom';
import PlayIcon from '@/components/PlayIcon';

const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const clothingSizes = ["XS","S", "M", "L", "XL", "XXL"]; 

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number | string>(1);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
        const products = getProductsFromStorage();
        const foundProduct = products.find((p: Product) => p.id === id); 
        if (foundProduct) { setProduct(foundProduct); } 
        else { router.push('/'); }
      }
  }, [id, router]);
  
  const showNotification = (message: string) => { setNotification({ show: true, message }); setTimeout(() => { setNotification({ show: false, message: '' }); }, 3000); };
  const handleQuantityChange = (value: string | number) => { if (!product) return; if (value === '') { setQuantity(''); return; } let numValue = Number(value); if (isNaN(numValue) || numValue < 1) { numValue = 1; } if (numValue > product.stock) { numValue = product.stock; showNotification(`Stok adedi aşılamaz (Maks: ${product.stock})`); } setQuantity(numValue); };
  const handleQuantityBlur = () => { if (quantity === '') { setQuantity(1); } }

  if (!product) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100) : 0;
  const activeMediaUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[currentImageIndex] : 'https://via.placeholder.com/600';
  const isActiveMediaVideo = activeMediaUrl.endsWith('.mp4') || activeMediaUrl.endsWith('.webm');

  const categoryLower = product.category.toLowerCase();
  const isShoeCategory = categoryLower.includes('ayakkabı');
  const isClothingCategory = categoryLower.includes('giyim') || categoryLower.includes('t-shirt') || categoryLower.includes('shirt') || categoryLower.includes('mont') || categoryLower.includes('pantolon') || categoryLower.includes('gömlek');
  const hasCustomSizes = product.sizes && product.sizes.length > 0;
  const shouldShowSizes = isShoeCategory || isClothingCategory || hasCustomSizes;
  let sizesToShow: string[] = [];
  let sizeLabel: string = "Beden Seç";
  if (isShoeCategory) { sizesToShow = shoeSizes; sizeLabel = "Numara Seç"; } 
  else if (isClothingCategory) { sizesToShow = clothingSizes; sizeLabel = "Beden Seç"; } 
  else if (hasCustomSizes) { sizesToShow = product.sizes!; sizeLabel = "Beden/Tip Seç"; }
  
  // --- handleAddToCart FONKSİYONU GÜNCELLENDİ ---
  const handleAddToCart = () => {
    if (!product) return;
    
    // 1. Beden Gerekli mi ve Seçildi mi?
    if (shouldShowSizes && !selectedSize) {
        showNotification(`Lütfen bir ${isShoeCategory ? 'numara' : 'beden'} seçin.`);
        return;
    }

    // 2. Adet Kontrolü
    const currentQuantity = Number(quantity);
    if (currentQuantity > product.stock) {
        showNotification(`Stokta yalnızca ${product.stock} adet kaldı!`);
        return;
    }
    
    // 3. Eklenecek 'CartItem' nesnesini oluştur
    const newItem: CartItem = {
      productId: product.id,
      quantity: currentQuantity,
      size: selectedSize // (örn: "42" veya "M" veya null)
    };

    // 4. 'storage.ts'deki fonksiyonu çağırarak sepete ekle
    addToCart(newItem);

    // 5. Kullanıcıyı bilgilendir
    const sizeInfo = selectedSize ? `(${selectedSize}${isShoeCategory ? ' Numara' : ' Beden'})` : '';
    showNotification(`${currentQuantity} adet ${sizeInfo} ${product.name} sepete eklendi.`);
  };

  return (
    <>
      <Notification show={notification.show} message={notification.message} />
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md max-w-5xl mx-auto my-10">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Ürün Listesine Dön
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Taraf - Görseller */}
          <div>
            <div className="relative">
              {isActiveMediaVideo ? (
                <video key={activeMediaUrl} className="w-full h-96 rounded-lg bg-black object-cover" controls autoPlay muted loop><source src={activeMediaUrl} type="video/mp4" /></video>
              ) : (
                <ImageZoom src={activeMediaUrl} alt={product.name || 'Ürün Detayı'} zoomScale={2.5} />
              )}
              {product.imageUrls && product.imageUrls.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImageIndex(prev => (prev === 0 ? product.imageUrls.length - 1 : prev - 1))} 
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 z-10"
                      aria-label="Önceki"
                    ><ChevronLeftIcon /></button>
                    <button onClick={() => setCurrentImageIndex(prev => (prev === product.imageUrls.length - 1 ? 0 : prev + 1))} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 z-10"
                      aria-label="Sonraki"
                    ><ChevronRightIcon /></button>
                  </>
              )}
            </div>
            <div className="flex space-x-2 mt-4 overflow-x-auto p-2">
                {product.imageUrls && product.imageUrls.map((url, index) => {
                  const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                  return (
                    <div key={index} onClick={() => setCurrentImageIndex(index)}
                      className={` relative w-20 h-20 object-contain rounded-md cursor-pointer border-2 p-1 flex-shrink-0 flex items-center justify-center bg-gray-100 ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'} `}
                    >
                      {isVideo ? (
                        <>
                          <video className="w-full h-full object-contain"><source src={`${url}#t=0.5`} type="video/mp4" /></video>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30"><PlayIcon /></div>
                        </>
                      ) : (
                        <img src={url} alt={`${product.name} - ${index+1}`} className="w-full h-full object-contain" />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          
          {/* Sağ Taraf - Bilgiler */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-baseline space-x-3 mt-4 flex-wrap">
                <p className={`font-bold ${hasDiscount ? 'text-red-500' : 'text-gray-900'} text-2xl sm:text-3xl`}>
                    {hasDiscount ? formatPriceWithoutSymbol(product.discountedPrice!) : formatPriceWithoutSymbol(product.price)}₺
                </p>
                {hasDiscount && (<p className="text-lg sm:text-xl text-gray-500 line-through">{formatPriceWithoutSymbol(product.price)}₺</p>)}
                {hasDiscount && <span className="bg-red-100 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-full">%{discountPercentage} İndirim</span>}
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="font-semibold text-gray-600">Satıcı:</span><span>{product.seller}</span>
                    <span className="font-semibold text-gray-600">Kategori:</span><span>{product.category}</span>
                    <span className="font-semibold text-gray-600">Stok Adedi:</span><span>{product.stock}</span>
                    <span className="font-semibold text-gray-600">ID:</span><span className="break-all">{product.id}</span>
                </div>
            </div>

            {shouldShowSizes && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700">
                  {sizeLabel}:
                  {selectedSize ? (
                    <span className="font-bold text-blue-600 ml-1">{selectedSize}</span>
                  ) : (
                    <span className="font-normal text-gray-500 ml-1">(Lütfen bir seçim yapın)</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {sizesToShow.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-5 rounded-lg border-2 font-medium text-center transition-colors duration-200 ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'}`}
                    >{size}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Sipariş Adedi</h3>
                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm border border-gray-200 w-36">
                    <button onClick={() => handleQuantityChange(Number(quantity) - 1)} 
                      className="flex-shrink-0 p-2.5 text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={Number(quantity) <= 1} aria-label="Adedi azalt"
                    ><MinusIcon /></button>
                    <input type="number" value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      onBlur={handleQuantityBlur}
                      className="flex-grow text-center text-lg font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                      max={product.stock} min={1} aria-label="Sipariş adedi"
                    />
                    <button onClick={() => handleQuantityChange(Number(quantity) + 1)} 
                      className="flex-shrink-0 p-2.5 text-gray-700 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={Number(quantity) >= product.stock} aria-label="Adedi artır"
                    ><PlusIcon /></button>
                </div>
                 {Number(quantity) >= product.stock && <p className="text-red-500 text-sm mt-2">Stokta yalnızca {product.stock} adet kaldı.</p>}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || quantity === '' || Number(quantity) === 0}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
                {product.stock > 0 ? 'Sepete Ekle' : 'Stok Tükendi'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}