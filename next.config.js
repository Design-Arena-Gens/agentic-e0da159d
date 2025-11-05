/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['replicate.delivery', 'oaidalleapiprodscus.blob.core.windows.net'],
  },
}

module.exports = nextConfig
