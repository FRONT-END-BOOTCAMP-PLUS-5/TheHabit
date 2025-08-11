import type { NextConfig } from "next";

import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  }),
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
