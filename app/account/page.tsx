// app/account/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '@/components/Notification';

// Gün, Ay, Yıl verileri
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

export default function AccountPage() {
  const router = useRouter();
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    isCorporate: false,
    gender: '',
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/'); 
      return;
    }
    const user = JSON.parse(currentUser);
    
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDay: user.birthDay || '',
      birthMonth: user.birthMonth || '',
      birthYear: user.birthYear || '',
      isCorporate: user.isCorporate || false,
      gender: user.gender || '',
    });
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'surname') {
        if (value.length > 16) return; 
        if (value !== '' && !/^\p{L}*$/u.test(value)) return; 
    }
    if (name === 'phone') {
        if (value.length > 10) return; 
        if (value !== '' && !/^\d*$/.test(value)) return; 
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isCorporate: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === formData.email);

    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        ...formData, // Telefon, Cinsiyet vb. hepsi buradan gelir
      };

      // 1. Ana kullanıcı listesini güncelle
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      // 2. Aktif oturumu güncelle (KRİTİK NOKTA)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setNotification({ show: true, message: 'Kullanıcı bilgileri başarıyla güncellendi.' });
      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
      
      setTimeout(() => window.location.reload(), 1000);
    }
  };
  // ... (Geri kalan JSX aynı) ...
  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all appearance-none";

  return (
    <div className="min-h-screen bg-white py-10">
      <Notification show={notification.show} message={notification.message} />
      
      <div className="max-w-5xl mx-auto px-4">
        
        <h2 className="text-lg font-bold text-orange-500 mb-6">Kullanıcı Bilgilerim</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Kullanıcı Bilgilerim</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={labelClass}>Ad</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Soyad</label>
                        <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} className={inputClass} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={labelClass}>E-Posta</label>
                        <input type="email" name="email" value={formData.email} disabled className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                        <p className="text-xs text-gray-400 mt-1">* E-posta adresi değiştirilemez.</p>
                    </div>
                    <div>
                        <label className={labelClass}>Cep Telefonu</label>
                        <div className="flex gap-3">
                            <div className="w-24 relative flex-shrink-0">
                                <select disabled className={`${selectClass} bg-gray-50 text-gray-500 pr-8`}>
                                    <option>+90</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            
                            <div className="flex-grow">
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="5XX XXX XX XX" maxLength={10} />
                            </div>

                            <button type="button" className="px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 transition-colors">
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={labelClass}>Doğum Tarihiniz</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Gün</option>
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                            </div>

                            <div className="relative">
                                <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Ay</option>
                                    {MONTHS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                                </select>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                            </div>

                            <div className="relative">
                                <select name="birthYear" value={formData.birthYear} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Yıl</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block"></div>
                </div>

                <div className="mb-8">
                    <label className={labelClass}>Cinsiyet</label>
                    <div className="flex gap-4 max-w-sm">
                        <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, gender: 'Kadin' }))}
                            className={`flex-1 py-3 px-4 border rounded-lg text-center text-sm font-medium transition-all ${formData.gender === 'Kadin' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                        >
                            Kadın
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, gender: 'Erkek' }))}
                            className={`flex-1 py-3 px-4 border rounded-lg text-center text-sm font-medium transition-all ${formData.gender === 'Erkek' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                        >
                            Erkek
                        </button>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Kurumsal</label>
                    <div className="flex items-start gap-3">
                        <input 
                            type="checkbox" 
                            id="corporate" 
                            checked={formData.isCorporate} 
                            onChange={handleCheckboxChange} 
                            className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" 
                        />
                        <label htmlFor="corporate" className="text-sm text-gray-700 cursor-pointer select-none">
                            İş yeri alışverişlerim için fırsatlardan haberdar olmak istiyorum.
                        </label>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button 
                        type="submit" 
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-16 rounded-lg transition-all shadow-md"
                    >
                        GÜNCELLE
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}