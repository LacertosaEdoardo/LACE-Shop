/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    // Custom webpack config for Cloudflare Workers
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
}

module.exports = nextConfig
