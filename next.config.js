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
  pageExtensions: ["page.ts", "page.tsx", "index.tsx", "index.ts", "config.ts"],
};

module.exports = nextConfig;
