import type { NextConfig } from "next";

// @ts-expect-error - next-pwa 타입 정의가 없음
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {}
  }
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);
