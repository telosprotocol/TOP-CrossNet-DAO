/** @type {import('next').NextConfig} */
const revision = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  distDir: 'dist',
  env: {
    NEXT_PUBLIC_BUILD_ID: revision,
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
