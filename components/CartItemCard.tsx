import { Product, CartItem } from '@/types';
import Link from 'next/link';
import { formatPriceWithoutSymbol } from '@/lib/format';
import MinusIcon from './MinusIcon';
import PlusIcon from './PlusIcon';
import TrashIcon from './TrashIcon';

interface CartItemCardProps {
  product: Product;
  cartItem: CartItem;
  onRemove: () => void;
  onQuantityChange: (newQuantity: number) => void;
}

export default function CartItemCard({ 
  product, 
  cartItem, 
  onRemove, 
  onQuantityChange 
}: CartItemCardProps) {
  
  const price = product.discountedPrice || product.price;
  const totalPrice = price * cartItem.quantity;

  const handleQuantityInput = (value: string) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) numValue = 1;
    if (numValue > product.stock) numValue = product.stock;
    onQuantityChange(numValue);
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg shadow-sm">
      {/* Resim */}
      <Link href={`/products/${product.id}`} className="flex-shrink-0">
        <img
          src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain border rounded-md"
        />
      </Link>
      
      
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-4 gap-4 sm:items-start">
        
        {/* İsim, Beden, Satıcı */}
        <div className="flex flex-col sm:col-span-2">
          <Link href={`/products/${product.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
            {product.name}
          </Link>
          <p className="text-sm text-gray-500">Satıcı: {product.seller}</p>
          {cartItem.size && (
            <p className="text-sm text-gray-500">
              Beden: <span className="font-medium text-gray-800">{cartItem.size}</span>
            </p>
          )}
          <button 
            onClick={onRemove}
            className="sm:hidden flex items-center gap-1 text-sm text-red-600 mt-2"
          >
            <TrashIcon /> Sil
          </button>
        </div>

        <div className="justify-self-start sm:justify-self-center sm:self-center">
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm border border-gray-200 w-36 h-10">
            <button 
              onClick={() => handleQuantityInput(String(cartItem.quantity - 1))} 
              className="p-2.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
              disabled={cartItem.quantity <= 1}
            ><MinusIcon /></button>
            
            <input 
              type="number"
              value={cartItem.quantity}
              onChange={(e) => handleQuantityInput(e.target.value)}
              className="w-full h-full text-center font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0"
              max={product.stock}
              min={1}
            />
            
            <button 
              onClick={() => handleQuantityInput(String(cartItem.quantity + 1))} 
              className="p-2.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
              disabled={cartItem.quantity >= product.stock}
            ><PlusIcon /></button>
          </div>
        </div>

        {/* Fiyat ve Masaüstü Sil Butonu */}
        <div className="flex flex-col items-start sm:items-end justify-between sm:col-span-1 h-full">
          <span className="font-bold text-lg text-red-500">
            {formatPriceWithoutSymbol(totalPrice)}₺
          </span>
          <button 
            onClick={onRemove}
            className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mt-4 sm:mt-0"
          >
            <TrashIcon /> Sil
          </button>
        </div>
      </div>
    </div>
  );
}