const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/0",
        permanent: true,
      },
    ];
  },
});
