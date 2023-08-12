/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["gitee.com"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
