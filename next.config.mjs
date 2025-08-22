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
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
