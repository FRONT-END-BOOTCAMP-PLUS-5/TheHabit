import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TheHabit - 습관 관리 앱',
    short_name: 'TheHabit',
    description: '당신의 습관을 체계적으로 관리하는 Progressive Web App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/images/icons/manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/images/icons/manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/images/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
  }
}