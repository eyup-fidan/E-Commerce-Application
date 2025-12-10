import { Product, CartItem } from '@/types';

const PRODUCTS_KEY = 'products';
const CART_KEY = 'cart';

// ÜRÜN FONKSİYONLARI
export const getProductsFromStorage = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const productsJson = localStorage.getItem(PRODUCTS_KEY);
  return productsJson ? JSON.parse(productsJson) : [];
};
export const saveProductsToStorage = (products: Product[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};
export const addProductToStorage = (product: Product): void => {
  const products = getProductsFromStorage();
  products.push(product);
  saveProductsToStorage(products);
};
export const deleteProductFromStorage = (productId: string): Product[] => {
    let products = getProductsFromStorage();
    products = products.filter(p => p.id !== productId);
    saveProductsToStorage(products);
    return products;
}
export const updateProductInStorage = (updatedProduct: Product): void => {
    let products = getProductsFromStorage();
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
        saveProductsToStorage(products);
    }
}
export const generateUniqueId = (): string => {
  const products = getProductsFromStorage();
  const existingIds = new Set(products.map(p => p.id));
  let newId: string;
  do {
    newId = Math.random().toString(36).substring(2, 9).toUpperCase();
  } while (existingIds.has(newId));
  return newId;
};

// SEPET FONKSİYONLARI 

// Olay Tetikleyici
const dispatchCartEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cartJson = localStorage.getItem(CART_KEY);
  return cartJson ? JSON.parse(cartJson) : [];
};

export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    dispatchCartEvent(); // Kaydettikten sonra Header'a haber ver
  }
};

export const addToCart = (newItem: CartItem): void => {
  let cart = getCartItems();
  const existingItemIndex = cart.findIndex(
    item => item.productId === newItem.productId && item.size === newItem.size
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }
  saveCartItems(cart);
};

export const removeFromCart = (productId: string, size: string | null): CartItem[] => {
  let cart = getCartItems();
  const updatedCart = cart.filter(
    item => !(item.productId === productId && item.size === size)
  );
  saveCartItems(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (productId: string, size: string | null, newQuantity: number): CartItem[] => {
  let cart = getCartItems();
  if (newQuantity <= 0) return removeFromCart(productId, size);

  const itemIndex = cart.findIndex(
    item => item.productId === productId && item.size === size
  );

  if (itemIndex > -1) {
    cart[itemIndex].quantity = newQuantity;
    saveCartItems(cart);
  }
  return cart;
};