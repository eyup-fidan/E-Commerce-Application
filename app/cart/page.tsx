'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, CartItem } from '@/types';
import { getProductsFromStorage, getCartItems, removeFromCart, updateCartItemQuantity, saveCartItems } from '@/lib/storage';
import CartItemCard from '@/components/CartItemCard';
import { formatPriceWithoutSymbol } from '@/lib/format'; 

interface MergedCartItem {
  cartInfo: CartItem;
  productInfo: Product;
}

export default function CartPage() {
  const [mergedCart, setMergedCart] = useState<MergedCartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Sepeti Yükleme ve Geçersiz Ürünleri Temizleme
  const loadCart = () => {
    const products = getProductsFromStorage();
    const cartItems = getCartItems();
    
    setAllProducts(products);

    // Geçerli ürünleri eşleştir
    const validItems: MergedCartItem[] = [];
    const validCartItemsForStorage: CartItem[] = [];
    let hasInvalidItems = false;

    cartItems.forEach(cartItem => {
      const productInfo = products.find(p => p.id === cartItem.productId);
      
      if (productInfo) {
        // Ürün hala sistemde varsa listeye ekle
        validItems.push({ cartInfo: cartItem, productInfo });
        validCartItemsForStorage.push(cartItem);
      } else {
        // Ürün sistemden silinmişse işaretle
        hasInvalidItems = true;
      }
    });

    setMergedCart(validItems);

    // Eğer silinmiş ürünler varsa localStorage'dan da temizle
    if (hasInvalidItems) {
      saveCartItems(validCartItemsForStorage);
    }
  };

  useEffect(() => {
    loadCart();
    
    // Header veya başka yerden gelen güncellemeleri dinle
    const handleStorageChange = () => loadCart();
    window.addEventListener('cartUpdated', handleStorageChange);
    return () => window.removeEventListener('cartUpdated', handleStorageChange);
  }, []);

  const handleQuantityChange = (productId: string, size: string | null, newQuantity: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert(`Stokta yalnızca ${product.stock} adet mevcut!`);
      return;
    }
    updateCartItemQuantity(productId, size, newQuantity);
  };

  const handleRemoveItem = (productId: string, size: string | null) => {
    removeFromCart(productId, size);
  };

  // Toplam Fiyat Hesaplama
  const totalPrice = mergedCart.reduce((total, item) => {
    const price = item.productInfo.discountedPrice || item.productInfo.price;
    return total + (price * item.cartInfo.quantity);
  }, 0);

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-2 inline-block">
        Sepetim ({mergedCart.length} Ürün)
      </h1>

      {mergedCart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            
            <div className="lg:col-span-2 flex flex-col gap-6">
            {mergedCart.map(({ cartInfo, productInfo }) => (
                <CartItemCard
                key={`${cartInfo.productId}-${cartInfo.size}`}
                product={productInfo}
                cartItem={cartInfo}
                onQuantityChange={(newQuantity) => 
                    handleQuantityChange(cartInfo.productId, cartInfo.size, newQuantity)
                }
                onRemove={() => 
                    handleRemoveItem(cartInfo.productId, cartInfo.size)
                }
                />
            ))}
            </div>

              
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Sipariş Özeti</h2>
                    
                    <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                        <span>Ürünlerin Toplamı</span>
                        <span className="font-medium">{formatPriceWithoutSymbol(totalPrice)} TL</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>Kargo Toplam</span>
                        <span className="font-medium text-green-600">Bedava</span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                        <span className="text-gray-900 font-bold text-lg">Toplam</span>
                        <span className="text-xl font-bold text-orange-600">{formatPriceWithoutSymbol(totalPrice)} TL</span>
                    </div>
                    
                    
                    <Link 
                        href="/checkout" 
                        className="block w-full bg-orange-600 text-white text-center py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100"
                    >
                        ALIŞVERİŞİ TAMAMLA
                    </Link>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Güvenli Alışveriş
                    </div>
                </div>
            </div>

        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700">Sepetinizde ürün bulunmuyor.</h2>
          <p className="text-gray-500 mt-2">Alışverişe başlamak için ürünler sayfasını ziyaret edebilirsiniz.</p>
          <Link href="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
            Alışverişe Başla
          </Link>
        </div>
      )}
    </div>
  );
}