// @/app/(admin)/layout.tsx (FILE BARU)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout ini polos, hanya meneruskan children.
  // Tidak ada Header, Footer, atau LenisProvider.
  return <>{children}</>;
}