export const HEADER = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

export const REDIS = {
  IMAGES: 'images'
} as const

export const EDGE_CONFIG = {
  BAN_AGENTS: 'ban-agents',
  BAN_CITIES: 'ban-cities',
  BAN_COUNTRIES: 'ban-countries',
  BAN_COUNTRY_REGIONS: 'ban-country-regions',
  BAN_IPS: 'ban-ips',
  BAN_REFERERS: 'ban-referers',
  LIVE2D_SRC: 'live2d-src',
  NETEASECLOUD_COOKIE: 'neteasecloud-cookie',
  NETEASECLOUD_PLAYLIST_ID: 'neteasecloud-playlist-id'
} as const

export const SELECTOR = {
  CLASSES: {},
  IDS: {
    ISSUES_MOBILE: 'issues-mobile',
    ISSUES_PC: 'issues-pc'
  }
} as const

export const SESSIONSTORAGE = {
  ANALYTIC_SUBMITTED: 'analytic-submitted',
  MONACO_BEFOREMOUNT: (language: string) => `monaco-beforemount-${language}`,
  POST_VIEW_SUBMITTED: (id: string) => `post-view-submitted-${id}`
} as const

export const EXT = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.avif', '.webp', '.exif', '.tga']
} as const
