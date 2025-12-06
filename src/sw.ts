import { CacheFirst, NetworkFirst, PrecacheEntry, Serwist, SerwistGlobalConfig, StaleWhileRevalidate } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST?: (PrecacheEntry | string)[]
  }
}
declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  clientsClaim: true,
  disableDevLogs: true,
  navigationPreload: true,
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true
  },
  // https://serwist.pages.dev/docs/serwist/runtime-caching
  runtimeCaching: [
    {
      handler: new CacheFirst({ cacheName: 'r2' }),
      matcher: ({ url }) => new URL(process.env.NEXT_PUBLIC_R2_URL).origin == url.origin
    },
    {
      handler: new CacheFirst({ cacheName: 'fonts' }),
      matcher: ({ request }) => request.destination == 'font'
    },
    {
      handler: new CacheFirst({ cacheName: 'images' }),
      matcher: ({ request }) => request.destination == 'image'
    },
    {
      handler: new CacheFirst({ cacheName: 'medias' }),
      matcher: ({ request }) => (['audio', 'video'] as RequestDestination[]).includes(request.destination)
    },
    {
      handler: new StaleWhileRevalidate({ cacheName: 'assets' }),
      matcher: ({ request }) => (['style', 'script', 'worker', 'sharedworker'] as RequestDestination[]).includes(request.destination)
    },
    {
      handler: new NetworkFirst({ cacheName: 'rsc' }),
      matcher: ({ request }) => request.headers.has('RSC')
    },
    {
      handler: new StaleWhileRevalidate({ cacheName: 'pages' }),
      matcher: ({ request, url }) => request.mode == 'navigate' && !url.pathname.startsWith('/auth/')
    },
    {
      handler: new NetworkFirst({ cacheName: 'apis' }),
      matcher: ({ request, url }) => request.method == 'GET' && url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth/')
    }
  ],
  skipWaiting: true
})

serwist.addEventListeners()
