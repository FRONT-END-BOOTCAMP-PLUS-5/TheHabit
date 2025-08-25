import type { NextConfig } from 'next';

import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  }),
  images: {
    domains: ['images.unsplash.com', 'k.kakaocdn.net', 'lh3.googleusercontent.com', 'img1.kakaocdn.net', 't1.kakaocdn.net',],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'habit-img.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;