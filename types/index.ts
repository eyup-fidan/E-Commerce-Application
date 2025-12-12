export interface Product {
  id: string;
  name: string;
  seller: string;
  stock: number;
  price: number;
  discountedPrice?: number;
  category: string;
  imageUrls: string[];
  sizes?: string[]; 
  rating?: number;
  reviewCount?: number;
}

 
export interface CartItem {
  productId: string;      // Hangi ürün? (ID'si)
  quantity: number;       // Kaç adet?
  size: string | null;    // Hangi beden? 
}