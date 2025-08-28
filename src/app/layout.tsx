// @/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '../app/components/LenisProvider';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';

// Konfigurasi font Inter dengan opsi optimalisasi
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

// Metadata yang disempurnakan untuk SEO dan Social Media Sharing
export const metadata: Metadata = {
  title: {
    template: '%s | Gohte Architects', // Judul halaman anak akan masuk di %s
    default: 'Gohte Architects', // Judul default untuk halaman utama
  },
  description: 'Portfolio of Gohte Architects, an innovative architecture firm based in Indonesia, showcasing residential and commercial projects.',
  
  // Open Graph (untuk media sosial seperti Facebook, LinkedIn, dll.)
  openGraph: {
    title: 'Gohte Architects',
    description: 'Portfolio of innovative residential and commercial projects.',
    url: 'https://nama-domain-anda.com', // Ganti dengan URL website Anda nanti
    siteName: 'Gohte Architects',
    images: [
      {
        url: '/og-image.png', // Gambar preview saat link dibagikan (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Gohte Architects Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Favicon & Icons
  // Pastikan file favicon.ico ada di dalam folder /app
  icons: {
    icon: '/favicon.ico',
    // Anda juga bisa menambahkan tipe lain seperti apple-touch-icon di sini
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${inter.className} antialiased`}
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