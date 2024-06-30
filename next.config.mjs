/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          crypto: false,
          stream: false,
          os: false,
          path: false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;