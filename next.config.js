/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'studio-nexora.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.dev',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

