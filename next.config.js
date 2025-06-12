/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Cambiato da 'standalone' a 'export' per Cloudflare Pages
  images: {
    unoptimized: true
  },
  // Disabilita il controllo del trailing slash per la compatibilità con Cloudflare Pages
  trailingSlash: false
}

module.exports = nextConfig
