import { CacheFirst, NetworkFirst, NetworkOnly, PrecacheEntry, Serwist, SerwistGlobalConfig, StaleWhileRevalidate } from 'serwist'

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
  precacheOptions: {
    cleanupOutdatedCaches: true
  },
  // https://serwist.pages.dev/docs/serwist/runtime-caching
  runtimeCaching: [
    {
      handler: new NetworkOnly(),
      matcher: ({ url }) =>
        url.pathname.startsWith('/auth/') ||
        url.pathname.startsWith('/api/auth/') ||
        url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/api/dashboard/')
    },
    {
      handler: new StaleWhileRevalidate({ cacheName: 'static' }),
      matcher: ({ url }) => url.pathname.startsWith('/_next/static/')
    },
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
      handler: new StaleWhileRevalidate({ cacheName: 'rsc' }),
      matcher: ({ request }) => request.headers.has('RSC')
    },
    {
      handler: new StaleWhileRevalidate({ cacheName: 'pages' }),
      matcher: ({ request, url }) => request.mode == 'navigate'
    },
    {
      handler: new NetworkFirst({ cacheName: 'apis', networkTimeoutSeconds: 2 }),
      matcher: ({ request, url }) => request.method == 'GET' && url.pathname.startsWith('/api/')
    }
  ],
  skipWaiting: true
})

serwist.addEventListeners()
