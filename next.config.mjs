/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
      },
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};


export default nextConfig;
