// @/app/(public)/layout.tsx  (FILE BARU)

import Header from '@/app/components/Header'; // Pastikan path import benar
import Footer from '@/app/components/Footer'; // Pastikan path import benar
import LenisProvider from '@/app/components/LenisProvider'; // Pastikan path import benar

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}