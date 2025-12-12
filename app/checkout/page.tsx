'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCartItems, saveCartItems } from '@/lib/storage';
import { Product, CartItem } from '@/types';
import { getProductsFromStorage } from '@/lib/storage';
import { formatPriceWithoutSymbol } from '@/lib/format';
import Notification from '@/components/Notification';

// TİPLER 
interface Address {
  id: string;
  title: string; 
  city: string;
  district: string;
  fullAddress: string;
  phone: string;
}

interface CreditCard {
  id: string;
  bank: string;
  holderName: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
}

// BANKA LİSTESİ 
const BANKS = [
    // Ziraat: Kırmızı ton geçişli
    { id: 'ziraat', name: 'Ziraat Bankası', gradient: 'bg-gradient-to-r from-red-700 to-red-500', text:'text-white' },
    // Garanti: Yeşil/Turkuaz geçişli
    { id: 'garanti', name: 'Garanti BBVA', gradient: 'bg-gradient-to-r from-teal-600 to-green-500', text:'text-white' },
    // Yapı Kredi: Lacivert/Mavi geçişli
    { id: 'yapikredi', name: 'Yapı Kredi', gradient: 'bg-gradient-to-r from-blue-800 to-blue-600', text:'text-white' },
    // İş Bankası: Koyu lacivert geçişli
    { id: 'isbank', name: 'İş Bankası', gradient: 'bg-gradient-to-r from-[#1F3D83] to-[#3456a3]', text:'text-white' },
    // Akbank: Parlak kırmızı geçişli
    { id: 'akbank', name: 'Akbank', gradient: 'bg-gradient-to-r from-[#D70C18] to-[#f03e48]', text:'text-white' },
];

// UZUN YASAL METİNLER 
const PRE_INFO_TEXT = `
MADDE 1 - KONU
İşbu Ön Bilgilendirme Formu'nun konusu, SATICI'nın, ALICI'ya satışını yaptığı, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince bilgilendirilmesidir.

MADDE 2 - SATICI BİLGİLERİ
Ünvanı: Ürün Yönetim Sistemi A.Ş.
Adresi: Örnek Mah. Teknoloji Cad. No:1 İstanbul
Telefon: 0850 123 45 67
E-posta: info@urunyönetim.com

MADDE 3 - ALICI BİLGİLERİ
Alıcı, sipariş esnasında girdiği ad, soyad, telefon ve adres bilgilerini beyan eder.

MADDE 4 - SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ
Malın / Ürünün / Hizmetin türü, miktarı, marka/modeli, rengi, adedi, satış bedeli, ödeme şekli, siparişin sonlandığı andaki bilgilerden oluşmaktadır.

MADDE 5 - GENEL HÜKÜMLER
5.1. ALICI, Madde 4'te belirtilen sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
5.2. Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
5.3. Ürünün teslimi için işbu Ön Bilgilendirme Formu'nun elektronik ortamda teyit edilmesi şarttır.

MADDE 6 - CAYMA HAKKI
ALICI; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.

(Bu metin örnektir ve tamamı çok daha uzundur...)
`;

const SALES_AGREEMENT_TEXT = `
MADDE 1 - TARAFLAR
1.1. SATICI: Ürün Yönetim Sistemi A.Ş. (Bundan sonra SATICI olarak anılacaktır)
1.2. ALICI: Sipariş veren müşteri (Bundan sonra ALICI olarak anılacaktır)

MADDE 2 - KONU
İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.

MADDE 3 - SÖZLEŞME KONUSU ÜRÜN, ÖDEME VE TESLİMAT BİLGİLERİ
3.1. Ürünlerin cinsi ve türü, miktarı, marka/modeli, rengi, vergiler dahil satış bedeli (adet x birim fiyat olarak) sipariş özeti sayfasında belirtildiği gibidir.
3.2. Ödeme Şekli: Kredi Kartı ile Ödeme
3.3. Teslimat Adresi: Alıcının beyan ettiği teslimat adresi.

MADDE 4 - GENEL HÜKÜMLER
4.1. ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
4.2. Taraflar, işbu sözleşme şartlarının yanı sıra Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerini kabul ettiklerini ve bu hükümlere uygun davranacaklarını kabul ve beyan ederler.

MADDE 5 - CAYMA HAKKI VE İSTİSNALARI
5.1. Tüketici, on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
5.2. Cayma hakkının kullanılması için bu süre içinde SATICI'ya yazılı olarak veya kalıcı veri saklayıcısı ile bildirimde bulunulması şarttır.
5.3. Niteliği itibarıyla iade edilemeyecek ürünler, tek kullanımlık ürünler, kopyalanabilir yazılım ve programlar, hızlı bozulan veya son kullanım tarihi geçen ürünler için cayma hakkı kullanılamaz.

MADDE 6 - UYUŞMAZLIKLARIN ÇÖZÜMÜ
İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.

(Bu metin örnektir ve gerçek bir sözleşmenin tamamını yansıtmamaktadır...)
`;

// İKONLAR 
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>);
const CreditCardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

export default function CheckoutPage() {
  const router = useRouter();
  
  // Data States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Selection & UI States
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [infoPanel, setInfoPanel] = useState<'pre-info' | 'sales-agreement' | 'success' | null>(null);

  // Form States
  const [addressForm, setAddressForm] = useState({ title: 'Ev', city: '', district: '', fullAddress: '', phone: '' });
  const [cardForm, setCardForm] = useState({ bank: 'ziraat', holderName: '', cardNumber: '', expireDate: '', cvv: '' });

  useEffect(() => {
    const cart = getCartItems();
    const allProducts = getProductsFromStorage();
    setCartItems(cart);
    setProducts(allProducts);
    const storedAddresses = localStorage.getItem('user_addresses');
    if (storedAddresses) setAddresses(JSON.parse(storedAddresses));
    const storedCards = localStorage.getItem('user_cards');
    if (storedCards) setCards(JSON.parse(storedCards));
  }, []);

  const showToast = (msg: string) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  // HESAPLAMALAR 
  const totalPrice = cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return total;
    const price = product.discountedPrice || product.price;
    return total + (price * item.quantity);
  }, 0);
  const cargoPrice = totalPrice > 5000 ? 0 : 49.90;
  const grandTotal = totalPrice + cargoPrice;

  // ADRES İŞLEMLERİ
  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === 'city' || name === 'district') {
          if (value.length > 16) return;
          if (value !== '' && !/^\p{L}*$/u.test(value)) return;
      }
      if (name === 'phone') {
          if (value.length > 10) return;
          if (value !== '' && !/^\d*$/.test(value)) return;
          if (value.length === 1 && value !== '5') return;
      }
      setAddressForm({ ...addressForm, [name]: value });
  };

  const handleSaveAddress = () => {
      if (!addressForm.city || !addressForm.district || !addressForm.fullAddress) return showToast("Lütfen tüm alanları doldurun.");
      if (addressForm.phone.length !== 10) return showToast("Telefon numarası 10 haneli olmalıdır (5XX...)");
      
      let updatedAddresses;
      if (editingAddressId) {
          updatedAddresses = addresses.map(a => a.id === editingAddressId ? { ...addressForm, id: editingAddressId } : a);
          setEditingAddressId(null);
      } else {
          const newAddr = { ...addressForm, id: Date.now().toString() };
          updatedAddresses = [...addresses, newAddr];
          setSelectedAddressId(newAddr.id);
      }
      setAddresses(updatedAddresses);
      localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
      setShowAddressForm(false);
      setAddressForm({ title: 'Ev', city: '', district: '', fullAddress: '', phone: '' });
  };

  const handleEditAddress = (addr: Address) => { setAddressForm(addr); setEditingAddressId(addr.id); setShowAddressForm(true); };
  const handleDeleteAddress = (id: string) => {
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
      localStorage.setItem('user_addresses', JSON.stringify(updated));
      if (selectedAddressId === id) setSelectedAddressId(null);
  };

  // KART İŞLEMLERİ 
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === 'holderName') {
          if (value.length > 20) return;
          if (value !== '' && !/^[a-zA-Z\s\u00C0-\u00FF]*$/.test(value)) return;
          setCardForm({ ...cardForm, [name]: value.toUpperCase() });
      } 
      else if (name === 'cardNumber') {
          const raw = value.replace(/\s/g, '');
          if (raw !== '' && !/^\d*$/.test(raw)) return;
          if (raw.length > 16) return;
          const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
          setCardForm({ ...cardForm, cardNumber: formatted });
      }
      else if (name === 'expireDate') {
          const raw = value.replace('/', '');
          if (raw !== '' && !/^\d*$/.test(raw)) return;
          if (raw.length > 4) return;
          if (raw.length >= 2) { const month = parseInt(raw.substring(0, 2)); if (month > 12 || month === 0) return; }
          let formatted = raw;
          if (raw.length >= 3) { formatted = raw.substring(0, 2) + '/' + raw.substring(2, 4); }
          setCardForm({ ...cardForm, expireDate: formatted });
      }
      else if (name === 'cvv') {
          if (value !== '' && !/^\d*$/.test(value)) return;
          if (value.length > 3) return;
          setCardForm({ ...cardForm, cvv: value });
      }
      else { setCardForm({ ...cardForm, [name]: value }); }
  };

  const handleSaveCard = () => {
      if (!cardForm.holderName || cardForm.cardNumber.length < 19 || cardForm.expireDate.length < 5 || cardForm.cvv.length < 3) {
          return showToast("Lütfen kart bilgilerini eksiksiz ve doğru giriniz.");
      }
      let updatedCards;
      if (editingCardId) {
          updatedCards = cards.map(c => c.id === editingCardId ? { ...cardForm, id: editingCardId } : c);
          setEditingCardId(null);
      } else {
          const newC = { ...cardForm, id: Date.now().toString() };
          updatedCards = [...cards, newC];
          setSelectedCardId(newC.id);
      }
      setCards(updatedCards);
      localStorage.setItem('user_cards', JSON.stringify(updatedCards));
      setShowCardForm(false);
      setCardForm({ bank: 'ziraat', holderName: '', cardNumber: '', expireDate: '', cvv: '' });
  };

  const handleEditCard = (card: CreditCard) => { setCardForm(card); setEditingCardId(card.id); setShowCardForm(true); };
  const handleDeleteCard = (id: string) => {
      const updated = cards.filter(c => c.id !== id);
      setCards(updated);
      localStorage.setItem('user_cards', JSON.stringify(updated));
      if (selectedCardId === id) setSelectedCardId(null);
  };

  const handleCompleteOrder = () => {
    if (!selectedAddressId) return showToast("Lütfen bir teslimat adresi seçin.");
    if (!selectedCardId) return showToast("Lütfen ödeme için bir kart seçin.");
    saveCartItems([]); 
    setInfoPanel('success'); 
  };

  const inputCss = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all";
  const labelCss = "block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Notification show={notification.show} message={notification.message} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        
        
        <div className="lg:col-span-2 space-y-6">
            
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><LocationIcon /> Teslimat Adresi</h2>
                    <button onClick={() => { setShowAddressForm(!showAddressForm); setEditingAddressId(null); setAddressForm({ title: 'Ev', city: '', district: '', fullAddress: '', phone: '' }); }} className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"><PlusIcon /> Yeni Adres</button>
                </div>

                {showAddressForm && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-orange-100 mb-6 animate-fade-in-down">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className={labelCss}>Adres Başlığı</label><select name="title" value={addressForm.title} onChange={handleAddressInput} className={inputCss}><option value="Ev">Ev</option><option value="İş">İş</option><option value="Diğer">Diğer</option></select></div>
                            <div><label className={labelCss}>Telefon</label><input type="text" name="phone" placeholder="5XX..." value={addressForm.phone} onChange={handleAddressInput} className={inputCss} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className={labelCss}>İl</label><input type="text" name="city" placeholder="İl" value={addressForm.city} onChange={handleAddressInput} className={inputCss} /></div>
                            <div><label className={labelCss}>İlçe</label><input type="text" name="district" placeholder="İlçe" value={addressForm.district} onChange={handleAddressInput} className={inputCss} /></div>
                        </div>
                        <div className="mb-4"><label className={labelCss}>Açık Adres</label><textarea rows={2} name="fullAddress" className={inputCss} placeholder="Mahalle, sokak, kapı no..." value={addressForm.fullAddress} onChange={handleAddressInput}></textarea></div>
                        <button onClick={handleSaveAddress} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-orange-700">{editingAddressId ? 'GÜNCELLE' : 'KAYDET'}</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedAddressId === addr.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2"><span className="font-bold text-gray-800">{addr.title}</span>{selectedAddressId === addr.id && <div className="text-orange-600"><CheckIcon /></div>}</div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="text-gray-400 hover:text-blue-500 p-1"><PencilIcon /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">{addr.fullAddress}</p>
                            <p className="text-xs text-gray-500 font-medium">{addr.district} / {addr.city}</p>
                            <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><CreditCardIcon /> Ödeme Yöntemi</h2>
                    <button onClick={() => { setShowCardForm(!showCardForm); setEditingCardId(null); setCardForm({ bank: 'ziraat', holderName: '', cardNumber: '', expireDate: '', cvv: '' }); }} className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"><PlusIcon /> Yeni Kart</button>
                </div>

                 {showCardForm && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-orange-100 mb-6 animate-fade-in-down">
                         <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">{editingCardId ? 'Kartı Düzenle' : 'Yeni Kart Ekle'}</h3>
                         <div className="mb-4"><label className={labelCss}>Banka Seçimi</label><select name="bank" value={cardForm.bank} onChange={handleCardInput} className={inputCss}>{BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                         <div className="mb-4"><label className={labelCss}>Kart Üzerindeki İsim</label><input type="text" name="holderName" className={inputCss} placeholder="AD SOYAD" value={cardForm.holderName} onChange={handleCardInput} /></div>
                         <div className="mb-4"><label className={labelCss}>Kart Numarası</label><input type="text" name="cardNumber" className={inputCss} placeholder="0000 0000 0000 0000" value={cardForm.cardNumber} onChange={handleCardInput} /></div>
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <div><label className={labelCss}>Son Kul. Tarihi</label><input type="text" name="expireDate" className={inputCss} placeholder="AA/YY" value={cardForm.expireDate} onChange={handleCardInput} /></div>
                            <div><label className={labelCss}>CVV</label><input type="text" name="cvv" className={inputCss} placeholder="123" maxLength={3} value={cardForm.cvv} onChange={handleCardInput} /></div>
                         </div>
                         <button onClick={handleSaveCard} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-orange-700">{editingCardId ? 'GÜNCELLE' : 'KAYDET'}</button>
                    </div>
                 )}

                 <div className="space-y-4">
                    {cards.map(card => {
                        const bank = BANKS.find(b => b.id === card.bank) || BANKS[0];
                        return (
                            
                            <div key={card.id} onClick={() => setSelectedCardId(card.id)} className={`group relative cursor-pointer rounded-xl transition-all overflow-hidden w-full md:w-80 mx-auto md:mx-0 shadow-sm hover:shadow-md ${selectedCardId === card.id ? 'ring-4 ring-orange-500 ring-offset-2' : 'opacity-90 hover:opacity-100'}`}>
                                <div className={`${bank.gradient} ${bank.text} p-5 h-36 flex flex-col justify-between relative rounded-xl`}>
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-sm tracking-wider opacity-90">{bank.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 my-1">
                                        <p className="text-lg font-mono tracking-widest drop-shadow-sm">{card.cardNumber}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div><p className="text-[8px] opacity-70 uppercase mb-0.5">Kart Sahibi</p><p className="font-medium text-[10px] uppercase tracking-wide truncate max-w-[120px]">{card.holderName}</p></div>
                                        <div className="text-right"><p className="text-[8px] opacity-70 mb-0.5">SKT</p><p className="font-medium text-[10px]">{card.expireDate}</p></div>
                                    </div>
                                    
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditCard(card); }} className="p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"><div className="text-white w-3 h-3"><PencilIcon /></div></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }} className="p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"><div className="text-white w-3 h-3"><TrashIcon /></div></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                 </div>
            </div>
        </div>

        
        <div className="lg:col-span-1 relative">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 z-20">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Sipariş Özeti</h3>
                
                <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                    <div className="flex justify-between text-sm text-gray-600"><span>Ürünler</span><span className="font-medium">{formatPriceWithoutSymbol(totalPrice)} TL</span></div>
                    <div className="flex justify-between text-sm text-gray-600"><span>Kargo</span><span className="font-medium">{cargoPrice === 0 ? 'Bedava' : `${formatPriceWithoutSymbol(cargoPrice)} TL`}</span></div>
                </div>
                
                <div className="flex justify-between items-end mb-6">
                    <span className="text-gray-800 font-bold text-lg">Toplam</span>
                    <span className="text-2xl font-bold text-orange-600">{formatPriceWithoutSymbol(grandTotal)} TL</span>
                </div>

                <div className="mb-6 space-y-2 text-xs text-gray-500">
                    <div className="flex items-start gap-2">
                        <input type="checkbox" id="agreement" className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                        <label htmlFor="agreement" className="leading-tight">
                            <button onClick={() => setInfoPanel('pre-info')} className="font-bold underline hover:text-orange-600 text-left">Ön Bilgilendirme Koşulları</button>'nı ve <button onClick={() => setInfoPanel('sales-agreement')} className="font-bold underline hover:text-orange-600 text-left">Mesafeli Satış Sözleşmesi</button>'ni okudum, onaylıyorum.
                        </label>
                    </div>
                </div>

                <button onClick={handleCompleteOrder} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">Siparişi Onayla</button>
            </div>
        </div>

      </div>

      
      {infoPanel && infoPanel !== 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">{infoPanel === 'pre-info' ? 'Ön Bilgilendirme Formu' : 'Mesafeli Satış Sözleşmesi'}</h2>
                    <button onClick={() => setInfoPanel(null)} className="text-gray-400 hover:text-gray-600 p-2"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                        {infoPanel === 'pre-info' ? PRE_INFO_TEXT : SALES_AGREEMENT_TEXT}
                    </div>
                </div>
                <div className="p-4 border-t shrink-0 text-center bg-gray-50 rounded-b-2xl">
                    <button onClick={() => setInfoPanel(null)} className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors text-sm">OKUDUM, ANLADIM</button>
                </div>
            </div>
        </div>
      )}
 
      
      {infoPanel === 'success' && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 animate-fade-in-down">
            <div className="text-center max-w-md w-full">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <svg className="w-14 h-14 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Siparişiniz Alındı!</h2>
                <p className="text-gray-500 mb-10 text-lg">Ödemeniz başarıyla alındı. Sipariş detayları e-posta adresinize gönderildi.</p>
                <button onClick={() => router.push('/')} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-transform hover:scale-105 shadow-xl shadow-orange-200">Alışverişe Devam Et</button>
            </div>
        </div>
      )}

    </div>
  );
}