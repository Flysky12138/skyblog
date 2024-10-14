import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#fff',
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    display: 'standalone',
    icons: [
      {
        sizes: 'any',
        src: '/favicon.ico',
        type: 'image/x-icon'
      }
    ],
    name: process.env.NEXT_PUBLIC_TITLE,
    short_name: process.env.NEXT_PUBLIC_TITLE,
    start_url: '/',
    theme_color: '#fff'
  }
}
