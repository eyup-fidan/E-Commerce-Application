'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addProductToStorage, getProductsFromStorage, updateProductInStorage, generateUniqueId } from '@/lib/storage';
import { Product } from '@/types';
import Tooltip from '@/components/Tooltip';
import InfoIcon from '@/components/InfoIcon';
import Notification from '@/components/Notification';
import { VALID_CATEGORY_NAMES } from '@/lib/categories'; 

export default function AddProductPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [updateId, setUpdateId] = useState<string | null>(null);

    const [product, setProduct] = useState({
        name: '', seller: '', stock: '', price: '',
        discountedPrice: '', category: '', sizes: '', rating: '', reviewCount: '', imageUrls: [''],
    });
    const [errors, setErrors] = useState<any>({});
    const [notification, setNotification] = useState({ show: false, message: '' });

    useEffect(() => {
        const productIdToUpdate = searchParams.get('update');
        if (productIdToUpdate) {
            setUpdateId(productIdToUpdate);
            const products = getProductsFromStorage();
            const foundProduct = products.find(p => p.id === productIdToUpdate);
            if (foundProduct) {
                setProduct({
                    name: foundProduct.name,
                    seller: foundProduct.seller,
                    stock: String(foundProduct.stock),
                    price: foundProduct.price ? String(foundProduct.price).replace('.', ',') : '',
                    discountedPrice: foundProduct.discountedPrice ? String(foundProduct.discountedPrice).replace('.', ',') : '',
                    category: foundProduct.category,
                    sizes: foundProduct.sizes ? foundProduct.sizes.join(',') : '',
                    rating: foundProduct.rating ? String(foundProduct.rating) : '',
                    reviewCount: foundProduct.reviewCount ? String(foundProduct.reviewCount) : '',
                    imageUrls: foundProduct.imageUrls.length > 0 ? foundProduct.imageUrls : [''],
                });
            }
        }
    }, [searchParams]);

    const showNotification = (message: string) => {
        setNotification({ show: true, message });
        setTimeout(() => { setNotification({ show: false, message: '' }); }, 3000);
    };

    // INPUT MASKELEME FONKSİYONU 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let isValidInput = true;

        switch (name) {
            case 'name':
                
                if (value.length > 0 && !/^\p{L}/u.test(value.charAt(0))) {
                    isValidInput = false;
                }
                break;

            case 'seller':

                if (value !== '') {
                    if (!/^[\p{L}0-9\s.-]*$/u.test(value)) isValidInput = false;
                    // İlk karakter kontrolü
                    if (value.length === 1 && !/^[\p{L}0-9]/u.test(value)) isValidInput = false;
                }
                break;

            case 'stock':
            case 'reviewCount':
                // Sadece Rakam.
                if (value !== '' && !/^\d*$/.test(value)) isValidInput = false;
                break;

            case 'price':
            case 'discountedPrice':
                
                if (value !== '' && !/^[\d.,]*$/.test(value)) isValidInput = false;
                break;

            case 'rating':
               
                if (value !== '') {
                    
                    if (!/^[\d.,]*$/.test(value)) {
                        isValidInput = false; 
                    } else {
                        // Mantıksal kontrol:
                        // Sadece "." veya "," ise engelle
                        if (value === '.' || value === ',') isValidInput = false;
                        
                        // 5'ten büyükse engelle 
                        const num = parseFloat(value.replace(',', '.'));
                        if (!isNaN(num) && num > 5) isValidInput = false;
                        
                        // İkinci bir nokta/virgül girişini engelle 
                        if ((value.match(/[.,]/g) || []).length > 1) isValidInput = false;
                    }
                }
                break;

            case 'sizes':
                // Harf, Rakam, Virgül, Boşluk
                if (value !== '' && !/^[a-zA-Z0-9,\s]*$/.test(value)) isValidInput = false;
                break;

            default:
                isValidInput = true;
        }

        if (isValidInput) {
            setProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    // URL İÇİN ÖZEL MASKELEME
    const handleImageUrlChange = (index: number, value: string) => {
        // Boşluk içeremez 
        if (value.includes(' ')) return;

        const newImageUrls = [...product.imageUrls];
        newImageUrls[index] = value;
        setProduct(prev => ({ ...prev, imageUrls: newImageUrls }));
    };

    const addImageUrlInput = () => {
        if (product.imageUrls.length < 5) setProduct(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
    };
    
    const handleRemoveImageUrl = (indexToRemove: number) => {
        const newImageUrls = product.imageUrls.filter((_, index) => index !== indexToRemove);
        setProduct(prev => ({ ...prev, imageUrls: newImageUrls }));
    };
    
    const validateForm = (): any => {
        const newErrors: any = {};
        
        if (!product.name) newErrors.name = 'Ürün adı zorunludur.';
        if (!product.seller) newErrors.seller = 'Satıcı bilgisi zorunludur.';
        if (!product.stock) newErrors.stock = 'Stok adedi zorunludur.';
        if (!product.category) newErrors.category = 'Lütfen bir kategori seçin.';

        const priceRegex = /^(\d{1,3}(\.\d{3})*|\d+)(\,\d{1,2})?$/;
        
        if (!product.price) {
            newErrors.price = 'Fiyat zorunludur.';
        } else if (!priceRegex.test(product.price)) {
            newErrors.price = 'Geçerli format: 1.000,50 veya 100,00';
        }
 
        if (product.discountedPrice && !priceRegex.test(product.discountedPrice)) {
            newErrors.discountedPrice = 'Geçerli format: 850,00';
        }

        if (!newErrors.price && !newErrors.discountedPrice && product.discountedPrice) {
            const priceFloat = parseFloat(product.price.replace(/\./g, '').replace(',', '.'));
            const discountedFloat = parseFloat(product.discountedPrice.replace(/\./g, '').replace(',', '.'));
            if (discountedFloat > priceFloat) {
                newErrors.discountedPrice = 'İndirimli fiyat normal fiyattan yüksek olamaz.';
            }
        }

        // URL Validasyonu (Submit anında HTTPS kontrolü)
        const urlErrors: string[] = [];
        let hasValidImage = false;
        product.imageUrls.forEach((url, index) => {
            if (url.trim() !== '') {
                if (!url.startsWith('https://')) {
                    urlErrors[index] = 'Görsel URL\'i https olmalıdır.';
                } else {
                    hasValidImage = true;
                }
            }
        });
        
        if (!hasValidImage) {
             if (!urlErrors[0] && product.imageUrls[0] === '') urlErrors[0] = 'En az bir görsel URL\'i zorunludur.';
        }
        
        if (Object.keys(urlErrors).length > 0) {
            newErrors.imageUrls = urlErrors;
        }

        return newErrors;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const priceForStorage = parseFloat(product.price.replace(/\./g, '').replace(',', '.'));
            const discountedPriceForStorage = product.discountedPrice ? parseFloat(product.discountedPrice.replace(/\./g, '').replace(',', '.')) : undefined;
            const sizesForStorage = product.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
            const ratingForStorage = product.rating ? parseFloat(product.rating.replace(',', '.')) : undefined;
            const reviewCountForStorage = product.reviewCount ? parseInt(product.reviewCount) : undefined;

            const formattedProduct: Omit<Product, 'id'> = {
                 name: product.name, seller: product.seller, stock: parseInt(product.stock),
                 price: priceForStorage, discountedPrice: discountedPriceForStorage,
                 category: product.category, 
                 sizes: sizesForStorage.length > 0 ? sizesForStorage : undefined,
                 rating: ratingForStorage, reviewCount: reviewCountForStorage,
                 imageUrls: product.imageUrls.filter(url => url.trim() !== ''),
            };
            
            if (updateId) {
                 const productToUpdate: Product = { ...formattedProduct, id: updateId };
                 updateProductInStorage(productToUpdate); showNotification('Ürün başarıyla güncellendi!');
            } else {
                 const newProduct: Product = { ...formattedProduct, id: generateUniqueId() };
                 addProductToStorage(newProduct); showNotification('Ürün başarıyla kaydedildi!');
            }
            setTimeout(() => { router.push('/'); }, 2000);
        }
    };
    
    const inputClasses = `block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`;

    return (
        <>
            <Notification show={notification.show} message={notification.message} />
            <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl mx-auto my-10 border border-gray-100">
                <h1 className="text-2xl font-bold mb-8 text-gray-800">
                    {updateId ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Ürün Adı *</label>
                            <Tooltip text="Ürün adı harf ile başlar. Her karakteri kabul eder."><InfoIcon /></Tooltip>
                        </div>
                        <input type="text" name="name" value={product.name} onChange={handleInputChange} className={`${inputClasses} ${errors.name ? 'border-red-500' : ''}`} placeholder="Örn: Adidas F50 Krampon" maxLength={50}/>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Satıcı Bilgisi *</label>
                                <Tooltip text="Satıcı bilgisi harf ya da rakam ile başlar. - ve . harici özel karakter içermez."><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="seller" value={product.seller} onChange={handleInputChange} className={`${inputClasses} ${errors.seller ? 'border-red-500' : ''}`} placeholder="Örn: ABC Ticaret" maxLength={50}/>
                            {errors.seller && <p className="text-red-500 text-xs mt-1">{errors.seller}</p>}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Kategori *</label>
                                <Tooltip text="Ürün sadece bu 8 kategoriden birine ait olabilir."><InfoIcon /></Tooltip>
                            </div>
                            <select name="category" value={product.category} onChange={handleInputChange} className={`${inputClasses} ${errors.category ? 'border-red-500' : ''}`}>
                                <option value="" disabled>Seçiniz...</option>
                                {VALID_CATEGORY_NAMES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Stok Adedi *</label>
                                <Tooltip text="Stok adedi sadece sayı içerir. Rakam dışında değer girilemez."><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="stock" value={product.stock} onChange={handleInputChange} className={`${inputClasses} ${errors.stock ? 'border-red-500' : ''}`} placeholder="Örn: 50" maxLength={9} />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Bedenler (Opsiyonel)</label>
                                <Tooltip text="Bedenleri virgülle ayırarak girin (Örn: 40,41,42 veya S,M,L)"><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="sizes" value={product.sizes} onChange={handleInputChange} className={inputClasses} placeholder="Örn: 40,41,42" maxLength={12} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Fiyat (₺) *</label>
                                <Tooltip text="Fiyat ondalıklı sayı olarak girilebilir. (Örn: 1.000,50)"><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="price" value={product.price} onChange={handleInputChange} className={`${inputClasses} ${errors.price ? 'border-red-500' : ''}`} placeholder="Örn: 1.000,50" maxLength={16} />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">İndirimli Fiyat (₺)</label>
                                <Tooltip text="Opsiyoneldir. Binlik ayracı için nokta (.), ondalık için virgül (,) kullanın."><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="discountedPrice" value={product.discountedPrice} onChange={handleInputChange} className={`${inputClasses} ${errors.discountedPrice ? 'border-red-500' : ''}`} placeholder="Örn: 850,00" maxLength={16} />
                            {errors.discountedPrice && <p className="text-red-500 text-xs mt-1">{errors.discountedPrice}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Puan (Opsiyonel)</label>
                                <Tooltip text="Ürünün 0-5 arası puanı (örn: 4.3 veya 4,3)"><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="rating" value={product.rating} onChange={handleInputChange} className={inputClasses} placeholder="Örn: 4.5" maxLength={3} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Yorum Sayısı (Opsiyonel)</label>
                                <Tooltip text="Ürünü değerlendiren toplam kişi sayısı"><InfoIcon /></Tooltip>
                            </div>
                            <input type="text" name="reviewCount" value={product.reviewCount} onChange={handleInputChange} className={inputClasses} placeholder="Örn: 398" maxLength={9} />
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <label className="block text-sm font-medium text-gray-700">Ürün Resimleri (URL)</label>
                            <Tooltip text="Görsel URL'i https olmalıdır."><InfoIcon /></Tooltip>
                        </div>
                        {product.imageUrls.map((url, index) => (
                            <div key={index} className="mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-grow">
                                        <input type="text" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} className={`${inputClasses} ${errors.imageUrls?.[index] ? 'border-red-500' : ''}`} placeholder={`Görsel veya Video URL ${index + 1} ${index === 0 ? '*' : ''}`} />
                                    </div>
                                    {index > 0 && <button type="button" onClick={() => handleRemoveImageUrl(index)} className="py-2 px-3 border border-red-500 text-red-500 text-sm font-medium rounded-md hover:bg-red-50 transition-colors">Sil</button>}
                                </div>
                                {errors.imageUrls?.[index] && <p className="text-red-500 text-xs mt-1">{errors.imageUrls[index]}</p>}
                            </div>
                        ))}
                        
                        {product.imageUrls.length < 5 && (
                            <button type="button" onClick={addImageUrlInput} 
                                className="mt-6 w-full py-3 px-4 border-2 border-dashed border-blue-300 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">+</span> Yeni Görsel Ekle (Max 5)
                            </button>
                        )}
                    </div>
                    
                    <div className="flex justify-center pt-6">
                        <button type="submit" 
                            className="bg-blue-600 text-white py-3 px-16 rounded-md font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
                        >
                            {updateId ? 'Güncelle' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}