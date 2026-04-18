import { CacheFirst, ExpirationPlugin, PrecacheEntry, Serwist, SerwistGlobalConfig, StaleWhileRevalidate } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST?: (PrecacheEntry | string)[]
  }
}
declare const self: ServiceWorkerGlobalScope

self.__SW_MANIFEST

const serwist = new Serwist({
  clientsClaim: true,
  disableDevLogs: true,
  navigationPreload: true,
  precacheEntries: undefined, // self.__SW_MANIFEST 放这里，会默认缓存所有静态资源，即使还未使用
  skipWaiting: true,
  precacheOptions: {
    cleanupOutdatedCaches: true
  },
  // https://serwist.pages.dev/docs/serwist/runtime-caching
  runtimeCaching: [
    {
      handler: new StaleWhileRevalidate({ cacheName: 'static' }),
      matcher: ({ url }) => url.pathname.startsWith('/_next/static/')
    },
    {
      handler: new CacheFirst({
        cacheName: 's3',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 7,
            maxEntries: 100
          })
        ]
      }),
      matcher: ({ url }) => new URL(process.env.NEXT_PUBLIC_R2_URL).origin == url.origin
    },
    {
      handler: new CacheFirst({ cacheName: 'font' }),
      matcher: ({ request }) => request.destination == 'font'
    },
    {
      handler: new CacheFirst({
        cacheName: 'image',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 300
          })
        ]
      }),
      matcher: ({ request }) => request.destination == 'image'
    },
    {
      handler: new CacheFirst({
        cacheName: 'audio',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 100,
            purgeOnQuotaError: true
          })
        ]
      }),
      matcher: ({ request }) => request.destination == 'audio'
    },
    {
      handler: new CacheFirst({
        cacheName: 'video',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 50,
            purgeOnQuotaError: true
          })
        ]
      }),
      matcher: ({ request }) => request.destination == 'video'
    },
    {
      handler: new CacheFirst({
        cacheName: 'cdn',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 90,
            maxEntries: 100
          })
        ]
      }),
      matcher: ({ url }) => url.pathname.startsWith('/cdn/') || url.origin == 'https://cdn.jsdelivr.net'
    },
    {
      handler: new CacheFirst({
        cacheName: 'public',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 90,
            maxEntries: 100
          })
        ]
      }),
      matcher: ({ url }) => ['/embed/', '/live2d/'].some(prefix => url.pathname.startsWith(prefix))
    }
  ]
})

serwist.addEventListeners()
