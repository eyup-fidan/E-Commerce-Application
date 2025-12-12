'use client';

import { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void; 
}


const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const EyeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const EyeSlashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>);
const GoogleIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
const FacebookIcon = () => (<svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>);

type ViewType = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password' | 'social-loading' | 'social-email';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<ViewType>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [socialProvider, setSocialProvider] = useState<'Google' | 'Facebook' | ''>('');
  const [socialEmail, setSocialEmail] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  const resetForm = () => {
      setError('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setName('');
      setSurname('');
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setSocialEmail('');
      setView('login');
  };

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'surname') {
        if (value.length > 16) return;
        if (value !== '' && !/^\p{L}*$/u.test(value)) return;
        name === 'name' ? setName(value) : setSurname(value);
    }
    if (name === 'email' || name === 'resetEmail' || name === 'socialEmail') {
        if (value.length > 30) return;
        if (value.includes(' ')) return;
        if (name === 'email') setEmail(value);
        else if (name === 'resetEmail') setResetEmail(value);
        else setSocialEmail(value);
    }
    if (name === 'password' || name === 'newPassword') {
        if (value.length > 16) return;
        name === 'password' ? setPassword(value) : setNewPassword(value);
    }
  };

  const handleSocialClick = (provider: 'Google' | 'Facebook') => {
    setSocialProvider(provider);
    setSocialEmail(''); 
    setError('');
    setView('social-email'); 
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialEmail.includes('@') || !socialEmail.includes('.')) {
        setError('Geçerli bir e-posta adresi giriniz.');
        return;
    }
    setView('social-loading');
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find((u: any) => u.email === socialEmail);
        
        if (existingUser) {
            localStorage.setItem('currentUser', JSON.stringify(existingUser));
            onLoginSuccess(existingUser);
            onClose();
        } else {
            setView('social-email'); 
            setError('Bu e-posta ile kayıtlı üyelik bulunamadı. Lütfen önce üye olun.');
        }
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@') || !email.includes('.')) { setError('Geçerli bir e-posta adresi giriniz.'); return; }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
    } else {
        setError('E-posta veya şifre hatalı.');
    }
  };

  // GÜNCELLENEN KAYIT FONKSİYONU
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !surname || !email || !password) { setError('Lütfen tüm alanları doldurunuz.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setError('Geçerli bir e-posta adresi giriniz.'); return; }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.email === email)) { setError('Bu e-posta adresi zaten kayıtlı.'); return; }

    // Telefon, Cinsiyet, Doğum Tarihi alanlarını boş olarak başlatıyoruz.
    // Böylece daha sonra güncellerken "undefined" sorunu yaşamıyoruz.
    const newUser = { 
        name, 
        surname, 
        email, 
        password,
        phone: '', 
        gender: '', 
        birthDay: '', 
        birthMonth: '', 
        birthYear: '', 
        isCorporate: false 
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  const clickForgotPassword = () => { setResetEmail(email); setView('forgot-password'); setError(''); setSuccessMsg(''); };
  
  const handleSendResetCode = (e: React.FormEvent) => {
      e.preventDefault();
      if(!resetEmail.includes('@')) { setError('Geçerli bir e-posta giriniz.'); return; }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === resetEmail);
      if (!userExists) { setError('Bu e-posta ile kayıtlı kullanıcı bulunamadı.'); return; }
      setSuccessMsg(`Doğrulama kodu ${resetEmail} adresine gönderildi.`);
      setError('');
      setTimeout(() => { setSuccessMsg(''); setView('verify-code'); }, 1500);
  };
  
  const handleVerifyCode = (e: React.FormEvent) => {
      e.preventDefault();
      if(resetCode.length < 4) { setError('Lütfen 4 haneli kodu giriniz.'); return; }
      setView('reset-password'); setError('');
  };
   
  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault();
      if(newPassword.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === resetEmail);
      if (userIndex !== -1) {
          users[userIndex].password = newPassword; 
          localStorage.setItem('users', JSON.stringify(users)); 
          setSuccessMsg('Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.');
          setTimeout(() => { setView('login'); setSuccessMsg(''); setEmail(''); setPassword(''); }, 2000);
      } else { setError('Bir hata oluştu.'); }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down min-h-[400px] flex flex-col">
        
        {view !== 'social-loading' && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10">
                <CloseIcon />
            </button>
        )}

        {(view === 'login' || view === 'register') && (
            <div className="flex text-center border-b border-gray-100 flex-shrink-0">
                <button onClick={() => setView('login')} className={`flex-1 py-5 text-sm font-bold transition-colors relative ${view === 'login' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Giriş Yap
                    {view === 'login' && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setView('register')} className={`flex-1 py-5 text-sm font-bold transition-colors relative ${view === 'register' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Üye Ol
                    {view === 'register' && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>}
                </button>
            </div>
        )}

        <div className="p-8 flex-grow flex flex-col justify-center">
            
            {/* LOGIN FORMU */}
            {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Hoş Geldiniz </h2>
                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}
                    {successMsg && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg text-center">{successMsg}</div>}
                    <div><label className={labelClass}>E-Posta</label><input type="text" name="email" value={email} onChange={handleInputChange} className={inputClass} placeholder="ornek@email.com" /></div>
                    <div className="relative"><label className={labelClass}>Şifre</label><input type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleInputChange} className={inputClass} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button></div>
                    <div className="flex justify-end"><button type="button" onClick={clickForgotPassword} className="text-xs font-medium text-orange-600 hover:underline">Şifremi Unuttum</button></div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">GİRİŞ YAP</button>
                    <div className="mt-6">
                        <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-gray-100"></div><span className="flex-shrink-0 mx-4 text-gray-400 text-xs">veya sosyal hesap ile</span><div className="flex-grow border-t border-gray-100"></div></div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button type="button" onClick={() => handleSocialClick('Facebook')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"><FacebookIcon /> Facebook</button>
                            <button type="button" onClick={() => handleSocialClick('Google')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"><GoogleIcon /> Google</button>
                        </div>
                    </div>
                </form>
            )}

            {/* DİĞER VIEW'LER AYNI (Social Email, Loading, Register, Forgot Pass vb.) */}
            {view === 'social-email' && (
                <form onSubmit={handleSocialSubmit} className="space-y-6">
                    <button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"><ArrowLeftIcon /> Geri Dön</button>
                    <div className="text-center">
                        <div className="w-14 h-14 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">{socialProvider === 'Google' ? <GoogleIcon /> : <FacebookIcon />}</div>
                        <h2 className="text-xl font-bold text-gray-900">{socialProvider} ile Giriş</h2>
                        <p className="text-sm text-gray-500 mt-1">Lütfen {socialProvider} hesabınıza bağlı e-posta adresinizi giriniz.</p>
                    </div>
                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}
                    <div><label className={labelClass}>E-Posta Adresiniz</label><input type="text" name="socialEmail" value={socialEmail} onChange={handleInputChange} className={inputClass} placeholder={`${socialProvider.toLowerCase()}@email.com`} autoFocus /></div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">DEVAM ET</button>
                </form>
            )}
            
            {view === 'social-loading' && (
                <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
                    <div className="relative"><div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center">{socialProvider === 'Google' ? <GoogleIcon /> : <FacebookIcon />}</div></div>
                    <div><h3 className="text-lg font-bold text-gray-900">Giriş Yapılıyor...</h3><p className="text-sm text-gray-500 mt-1">Bilgileriniz doğrulanıyor, lütfen bekleyiniz.</p></div>
                </div>
            )}

            {view === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Aramıza Katılın </h2>
                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Ad</label><input type="text" name="name" value={name} onChange={handleInputChange} className={inputClass} placeholder="Adınız" /></div>
                        <div><label className={labelClass}>Soyad</label><input type="text" name="surname" value={surname} onChange={handleInputChange} className={inputClass} placeholder="Soyadınız" /></div>
                    </div>
                    <div><label className={labelClass}>E-Posta</label><input type="text" name="email" value={email} onChange={handleInputChange} className={inputClass} placeholder="ornek@email.com" /></div>
                    <div className="relative"><label className={labelClass}>Şifre</label><input type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleInputChange} className={inputClass} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button></div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">ÜYE OL</button>
                </form>
            )}

            {view === 'forgot-password' && (<form onSubmit={handleSendResetCode} className="space-y-4"><button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1 text-sm"><ArrowLeftIcon /> Geri Dön</button><h2 className="text-xl font-bold text-gray-900 text-center mb-2">Şifre Sıfırlama </h2><p className="text-sm text-gray-500 text-center mb-6">E-posta adresinizi girin, size bir doğrulama kodu gönderelim.</p>{error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}{successMsg && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg text-center">{successMsg}</div>}<div><label className={labelClass}>E-Posta</label><input type="text" name="resetEmail" value={resetEmail} onChange={handleInputChange} className={inputClass} placeholder="ornek@email.com" /></div><button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors">KOD GÖNDER</button></form>)}
            {view === 'verify-code' && (<form onSubmit={handleVerifyCode} className="space-y-4"><h2 className="text-xl font-bold text-gray-900 text-center mb-2">Kodu Doğrula </h2><p className="text-sm text-gray-500 text-center mb-6">{resetEmail} adresine gelen 4 haneli kodu giriniz.</p>{error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}<div className="flex justify-center"><input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="w-40 text-center text-2xl tracking-widest py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none" maxLength={4} placeholder="0000" /></div><button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors">DOĞRULA</button></form>)}
            {view === 'reset-password' && (<form onSubmit={handleResetPassword} className="space-y-4"><h2 className="text-xl font-bold text-gray-900 text-center mb-6">Yeni Şifre Oluştur </h2>{error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">{error}</div>}<div className="relative"><label className={labelClass}>Yeni Şifre</label><input type={showPassword ? "text" : "password"} name="newPassword" value={newPassword} onChange={handleInputChange} className={inputClass} placeholder="En az 6 karakter" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPassword ? <EyeSlashIcon /> : <EyeIcon />}</button></div><button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold hover:bg-orange-700 transition-colors">ŞİFREYİ GÜNCELLE</button></form>)}

        </div>
      </div>
    </div>
  );
}