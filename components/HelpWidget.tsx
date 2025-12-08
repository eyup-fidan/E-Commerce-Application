// components/HelpWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

// --- İKONLAR ---
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>);
const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>);

// --- AVATAR ---
const AgentAvatar = () => (
  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
  </div>
);

// --- TİPLER ---
type MessageType = 'text' | 'options' | 'order-form' | 'contact-form' | 'return-info';
type Sender = 'bot' | 'user';

interface Message {
  id: number;
  sender: Sender;
  type: MessageType;
  content?: string;
  data?: any; 
}

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Otomatik Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // İlk Açılış Mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('text', 'Merhaba! Ürün Yönetim Sistemi destek hattına hoş geldiniz. Size nasıl yardımcı olabiliriz?');
      setTimeout(() => {
        addBotMessage('options', '', [
          { id: 'order', text: 'Siparişimin durumu nedir?' },
          { id: 'return', text: 'İade ve değişim koşulları' },
          { id: 'contact', text: 'Müşteri Temsilcisine Yaz' }
        ]);
      }, 600);
    }
  }, [isOpen]);

  const addBotMessage = (type: MessageType, content: string = '', data: any = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', type, content, data }]);
    }, 800); 
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', type: 'text', content: text }]);
  };

  const handleOptionClick = (optionId: string, optionText: string) => {
    addUserMessage(optionText);

    if (optionId === 'order') {
        addBotMessage('text', 'Sipariş durumunuzu kontrol edebilmem için lütfen sipariş numaranızı giriniz.');
        setTimeout(() => addBotMessage('order-form'), 1000);
    } else if (optionId === 'return') {
        addBotMessage('return-info');
        setTimeout(() => {
            addBotMessage('text', 'Başka bir konuda yardımcı olabilir miyim?');
            setTimeout(() => addBotMessage('options', '', [
                { id: 'menu', text: 'Ana Menüye Dön' },
                { id: 'contact', text: 'Temsilciye Bağlan' }
            ]), 800);
        }, 2000);
    } else if (optionId === 'contact') {
        addBotMessage('text', 'Size daha hızlı yardımcı olabilmemiz için lütfen konuyu seçip mesajınızı yazınız.');
        setTimeout(() => addBotMessage('contact-form'), 1000);
    } else if (optionId === 'menu') {
        addBotMessage('text', 'Ana menü seçenekleri:');
        setTimeout(() => addBotMessage('options', '', [
            { id: 'order', text: 'Siparişimin durumu nedir?' },
            { id: 'return', text: 'İade ve değişim koşulları' },
            { id: 'contact', text: 'Müşteri Temsilcisine Yaz' }
        ]), 800);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setTimeout(() => setIsOpen(false), 100); 
  };

  // --- İÇERİK BİLEŞENLERİ ---

  // 1. SİPARİŞ SORGULAMA FORMU (VALIDASYONLU)
  const OrderForm = () => {
    const [val, setVal] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (val.length !== 9) return;
        setStatus('loading');
        setTimeout(() => {
            setStatus('done');
            addBotMessage('text', `Siparişiniz (${val}) hazırlanıyor. Tahmini kargoya veriliş: Yarın.`);
            setTimeout(() => addBotMessage('options', '', [{ id: 'menu', text: 'Başka işlem yap' }]), 1500);
        }, 1500);
    };

    if (status === 'done') return null;

    return (
        <form onSubmit={check} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-64 mt-2">
            <label className="text-xs font-bold text-gray-500 mb-1 block">SİPARİŞ NUMARASI</label>
            <input 
                type="text" 
                className="w-full border border-gray-300 rounded p-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: 123456789"
                value={val}
                onChange={(e) => {
                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 9) setVal(e.target.value);
                }}
            />
            <button 
                type="submit" 
                disabled={val.length !== 9 || status === 'loading'}
                className="w-full bg-blue-600 text-white text-sm font-bold py-2 rounded disabled:opacity-50"
            >
                {status === 'loading' ? 'Sorgulanıyor...' : 'Sorgula'}
            </button>
        </form>
    );
  };

  // 2. İLETİŞİM FORMU (GENİŞLETİLMİŞ SEÇENEKLER)
  const ContactForm = () => {
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({ subject: '', msg: '' });

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.msg) return;
        setSent(true);
        addBotMessage('text', 'Mesajınız ilgili birime iletildi. En kısa sürede size dönüş yapılacaktır.');
        setTimeout(() => addBotMessage('options', '', [{ id: 'menu', text: 'Ana Menü' }]), 1500);
    };

    if (sent) return null;

    return (
        <form onSubmit={send} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-64 mt-2">
            <label className="text-xs font-bold text-gray-500 mb-1 block">KONU SEÇİNİZ</label>
            
            {/* --- GENİŞLETİLMİŞ SEÇENEKLER BURADA --- */}
            <select 
                className="w-full border border-gray-300 rounded p-2 text-xs mb-2 outline-none bg-white"
                onChange={e => setFormData({...formData, subject: e.target.value})}
            >
                <option>Sipariş Durumu</option>
                <option>Kargo ve Teslimat</option>
                <option>İade ve Değişim Talebi</option>
                <option>Ürün Bilgisi</option>
                <option>Ödeme İşlemleri</option>
                <option>Hasarlı / Eksik Ürün</option>
                <option>Kampanya ve İndirimler</option>
                <option>Öneri / Şikayet</option>
                <option>Diğer</option>
            </select>

            <label className="text-xs font-bold text-gray-500 mb-1 block">MESAJINIZ</label>
            <textarea 
                rows={3}
                className="w-full border border-gray-300 rounded p-2 text-xs mb-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Nasıl yardımcı olabiliriz?"
                value={formData.msg}
                onChange={e => setFormData({...formData, msg: e.target.value})}
            ></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white text-sm font-bold py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                Gönder <SendIcon />
            </button>
        </form>
    );
  };

  // 3. İADE BİLGİ KARTI
  const ReturnInfo = () => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-64 mt-2 space-y-2">
        <div className="flex gap-2 items-start">
            <span className="text-green-500 text-lg"></span>
            <p className="text-xs text-gray-600"><strong>14 Gün İade Hakkı:</strong> Teslim tarihinden itibaren 14 gün içinde koşulsuz iade.</p>
        </div>
        <div className="flex gap-2 items-start">
            <span className="text-green-500 text-lg"></span>
            <p className="text-xs text-gray-600"><strong>Ücretsiz Kargo:</strong> Anlaşmalı kod ile gönderim tarafımıza aittir.</p>
        </div>
        <div className="flex gap-2 items-start">
            <span className="text-green-500 text-lg"></span>
            <p className="text-xs text-gray-600"><strong>Ürün Durumu:</strong> Ambalajı açılmamış, kullanılmamış olmalıdır.</p>
        </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <div 
        className={`
          bg-slate-100 rounded-2xl shadow-2xl mb-4 w-[350px] sm:w-[380px] overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out transform origin-bottom-right border border-gray-200
          ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[500px]' : 'scale-90 opacity-0 translate-y-10 pointer-events-none h-0'}
        `}
      >
        {/* HEADER */}
        <div className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <AgentAvatar />
            <div>
                <h3 className="font-bold text-sm">Destek Asistanı</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-xs text-blue-100 opacity-90">Çevrimiçi</p>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetChat} className="hover:bg-white/20 p-1.5 rounded-full transition" title="Sohbeti Temizle"><RefreshIcon /></button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition"><CloseIcon /></button>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#e5ded8] bg-opacity-30"> 
            
            {messages.map((msg) => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {msg.sender === 'bot' && (
                        <div className="mr-2 mt-1"><AgentAvatar /></div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-sm relative
                        ${msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }
                    `}>
                        {/* METİN MESAJI */}
                        {msg.type === 'text' && <p>{msg.content}</p>}

                        {/* SEÇENEK BUTONLARI */}
                        {msg.type === 'options' && (
                            <div className="flex flex-col gap-2 mt-1">
                                {msg.data.map((opt: any) => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => handleOptionClick(opt.id, opt.text)}
                                        className="text-left px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors border border-blue-100"
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ÖZEL FORMLAR */}
                        {msg.type === 'order-form' && <OrderForm />}
                        {msg.type === 'contact-form' && <ContactForm />}
                        {msg.type === 'return-info' && <ReturnInfo />}

                        {/* ZAMAN */}
                        <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(msg.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex justify-start mb-4">
                    <div className="mr-2 mt-1"><AgentAvatar /></div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-16 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-white border-t text-center text-xs text-gray-400">
              Ürün Yönetim Asistanı
        </div>

      </div>

      {/* LAUNCHER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50
          ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {isOpen ? <CloseIcon /> : (
          <div className="relative">
             <ChatIcon />
             <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
          </div>
        )}
      </button>
    </div>
  );
}