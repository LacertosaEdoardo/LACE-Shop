/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Configura i domini consentiti per le immagini, se necessario
  images: {
    domains: ['localhost']
  }
}

module.exports = nextConfig
