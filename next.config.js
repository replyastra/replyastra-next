/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.cache = false; // 🔥 IMPORTANT
    return config;
  },
};

module.exports = nextConfig;
