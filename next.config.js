/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/0",
        permanent: true
      }
    ]
  },
  images: {
    domains: ['localhost:3000'],
  }
};