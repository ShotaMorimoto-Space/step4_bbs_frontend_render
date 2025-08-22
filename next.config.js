/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  poweredByHeader: false,
  compress: true,
  generateEtags: false
}
module.exports = nextConfig
