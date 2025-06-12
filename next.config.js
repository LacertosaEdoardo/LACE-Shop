/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Cambiato da 'export' a 'standalone' per supportare SSR
  images: {
    unoptimized: true
  },
  trailingSlash: false
}

module.exports = nextConfig
