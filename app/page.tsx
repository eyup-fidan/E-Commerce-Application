'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductsFromStorage, deleteProductFromStorage } from '@/lib/storage';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import DeleteToast from '@/components/DeleteToast'; 
import FavoriteToast from '@/components/FavoriteToast';
import Pagination from '@/components/Pagination';
import CategoryNav from '@/components/CategoryNav'; 

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const searchParams = useSearchParams(); 
  const searchTerm = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPageProducts, setCurrentPageProducts] = useState<Product[]>([]); 
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const productsFromStorage = getProductsFromStorage();
    setAllProducts(productsFromStorage);
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) setFavorites(new Set(JSON.parse(storedFavorites)));
  }, []); 

  useEffect(() => {
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered); 
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setCurrentPageProducts(filtered.slice(startIndex, endIndex));
  }, [searchTerm, currentPage, allProducts]);

  
  const showFavoriteToast = (message: string) => { setToast({ show: true, message }); setTimeout(() => { setToast({ show: false, message: '' }); }, 2000); };
  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); e.stopPropagation(); const newFavorites = new Set(favorites);
    if (favorites.has(productId)) { newFavorites.delete(productId); showFavoriteToast('Favorilerden kaldırıldı'); } 
    else { newFavorites.add(productId); showFavoriteToast('Favorilere eklendi!'); }
    setFavorites(newFavorites); localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };
  const openDeleteModal = (product: Product) => { setProductToDelete(product); setIsModalOpen(true); };
  const closeDeleteModal = () => { setProductToDelete(null); setIsModalOpen(false); };
  const handleConfirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = deleteProductFromStorage(productToDelete.id);
      setAllProducts(updatedProducts); 
      closeDeleteModal(); 
    }
  };

  return (
    <> 
      <FavoriteToast show={toast.show} message={toast.message} />
      <CategoryNav />

      <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-2 inline-block">
        Tüm Ürünler ({filteredProducts.length})
      </h1>
      
      {currentPageProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {currentPageProducts.map((product) => (
              <ProductCard 
                key={product.id} product={product} onDelete={openDeleteModal}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
              />
            ))}
          </div>
          <Pagination totalItems={filteredProducts.length} itemsPerPage={ITEMS_PER_PAGE} currentPage={currentPage} />
        </>
      ) : (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-700">
              {searchTerm ? 'Aradığınız ürün bulunamadı.' : 'Henüz ürün eklenmemiş.'}
            </h2>
        </div>
      )}

      <DeleteToast isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} productName={productToDelete?.name || ''} />
    </>
  );
}