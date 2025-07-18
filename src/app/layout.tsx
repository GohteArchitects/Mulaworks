import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '../app/components/LenisProvider';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';

// Konfigurasi font Inter dengan opsi optimalisasi
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable (opsional)
  display: 'swap', // Hindari FOIT (Flash of Invisible Text)
  weight: ['400', '500', '600', '700'], // Preload semua varian yang dibutuhkan
  adjustFontFallback: true, // Fallback otomatis untuk font sistem
});

export const metadata: Metadata = {
  title: 'Gohte Architects',
  description: 'Indonesian Architects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${inter.className} antialiased`} // Gunakan kelas dan CSS variable
    >
      <body className="font-sans bg-white text-gray-900">
        <LenisProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}