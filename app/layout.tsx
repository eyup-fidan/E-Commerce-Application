import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import HelpWidget from '@/components/HelpWidget'; 
import CookieConsent from '@/components/CookieConsent'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ürün Yönetim Sistemi',
  description: 'Next.js ile ürün yönetim projesi',
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1,
  maximumScale: 1, userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Header /> 
        
        <main className="max-w-6xl mx-auto p-4">
          {children}
        </main>

        <HelpWidget />
        

        <CookieConsent />
      </body>
    </html>
  );
}