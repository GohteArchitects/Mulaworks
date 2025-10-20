// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Konfigurasi yang sudah ada untuk Supabase (JANGAN DIHAPUS)
      {
        protocol: 'https',
        hostname: 'ihjgyjucrukxybcnvyxf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 👇 TAMBAHKAN BLOK INI untuk ImageBB 👇
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;