/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  env: {
    NEXT_PUBLIC_ENABLE_PER_VIDEO: process.env.ENABLE_PER_VIDEO || '0',
  },
}

module.exports = nextConfig
