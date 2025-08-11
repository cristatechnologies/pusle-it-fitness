/** @type {import('next').NextConfig} */
const { hostname } = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`);







const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  devIndicators: false,
  images: {
    domains: [`${hostname}`, "img.youtube.com"],
  },
};

module.exports = nextConfig;





  // typescript: {
  //   // This will ignore TypeScript errors during the build process
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   // This will ignore ESLint errors during the build process
  //   ignoreDuringBuilds: true,
  // },