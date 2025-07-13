import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LenisProvider from '../../components/LenisProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Admin Panel | My App',
};

export default function AdminLayout({
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
          <div className="min-h-screen">
            {children}
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}