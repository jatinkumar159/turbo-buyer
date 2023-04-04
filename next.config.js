/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  distDir: 'build',
  trailingSlash: true,
  images: {
    unoptimized: true,
    loader: 'custom',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // assetPrefix: './'
}

module.exports = nextConfig
