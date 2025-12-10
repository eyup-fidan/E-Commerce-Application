'use client';

import { useState, useEffect } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: (updatedUser: any) => void;
}

const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

export default function ProfileModal({ isOpen, onClose, onUpdateSuccess }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal açıldığında mevcut bilgileri doldur
  useEffect(() => {
    if (isOpen) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser) {
        setName(currentUser.name || '');
        setSurname(currentUser.surname || '');
        setEmail(currentUser.email || '');
        // Güvenlik gereği şifre inputunu boş bırakıyoruz, isterse doldurur
        setPassword(''); 
        setSuccessMsg('');
      }
    }
  }, [isOpen]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Mevcut kullanıcı listesini al
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Şuanki kullanıcının indexini bul
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex !== -1) {
      // Bilgileri güncelle
      const updatedUser = {
        ...users[userIndex],
        name: name,
        surname: surname,
        // Eğer şifre alanına bir şey yazıldıysa şifreyi de güncelle, yoksa eskisi kalsın
        password: password.trim() !== '' ? password : users[userIndex].password
      };

      // Listeyi güncelle ve kaydet
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));

      // Oturumdaki kullanıcıyı güncelle ve kaydet
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setSuccessMsg('Bilgileriniz başarıyla güncellendi.');
      
      // Ana sayfaya bildir ve kapat
      setTimeout(() => {
        onUpdateSuccess(updatedUser);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
        </button>

        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Hesap Bilgilerim</h2>
            
            {successMsg && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg text-center mb-4 font-medium">{successMsg}</div>}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Ad</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Soyad</label>
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} className={inputClass} />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>E-Posta (Değiştirilemez)</label>
                    <input type="text" value={email} disabled className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                </div>

                <div>
                    <label className={labelClass}>Yeni Şifre (İsteğe Bağlı)</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Değiştirmek istemiyorsanız boş bırakın" />
                </div>

                <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 mt-2">
                    GÜNCELLE
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}