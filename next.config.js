/** @type {import('next').NextConfig} */
// Baris di atas ini menggantikan 'import type' dan tetap memberikan autocomplete.
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ihjgyjucrukxybcnvyxf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  // Any other Next.js configurations can go here
};

// Menggunakan module.exports untuk kompatibilitas dengan Next.js 14
module.exports = nextConfig;