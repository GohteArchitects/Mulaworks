// @/app/layout.tsx (VERSI BARU YANG SUDAH DIBERSIHKAN)

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

// Metadata bisa tetap di sini karena bersifat global
export const metadata: Metadata = {
  title: {
    template: '%s | Gohte Architects',
    default: 'Gohte Architects',
  },
  description: 'Portfolio of Gohte Architects, an innovative architecture firm based in Indonesia, showcasing residential and commercial projects.',
  // ... sisa metadata Anda (Open Graph, icons, dll) bisa tetap di sini
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const removeFdProcessedId = {
    __html: `
      if (typeof window !== 'undefined') {
        const elements = document.querySelectorAll('[fdprocessedid]');
        elements.forEach(el => el.removeAttribute('fdprocessedid'));
      }
    `,
  };

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${inter.className} antialiased`}
    >
      <head>
        {/* Tambahkan skrip ini untuk mencegah "Hydration Mismatch" */}
        <script dangerouslySetInnerHTML={removeFdProcessedId} />
      </head>
      <body className="font-sans bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}