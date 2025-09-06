import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // 공개 페이지 예외 허용
        allow: [
          '/onboarding',
          '/user/dashboard/*',
          '/user/feedback/*',
          '/user/search/*',
          '/user/profile/*',
        ],
        disallow: [
          '/api',
          '/login',
          '/signup',
          '/user',
          '/user/*',
          '/user/profile',
          '/user/notification',
          '/user/follow',
        ],
      },
    ],
    sitemap: 'https://thehabit.quest',
  };
}
