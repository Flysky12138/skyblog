/** 请求头 */
export const HEADER = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

/** edge 对象 key */
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

/** 元素 attribute */
export const ATTRIBUTE = {
  ID: {
    ISSUES_MOBILE: 'issues-mobile',
    ISSUES_PC: 'issues-pc',
    POST_CONTAINER: 'post-container'
  }
} as const

/** `window.sessionStorage` key */
export const SESSIONSTORAGE = {
  ANALYTIC_SUBMITTED: 'analytic-submitted',
  POST_VIEW_SUBMITTED: (id: string) => `post-view-submitted-${id}`
} as const

/** `useSwr` key */
export const SWR_KEY = {
  CLASH_TEMPLATES: '/api/dashboard/clash/template'
} as const

/** css `view-transition-name` */
export const VIEW_TRANSITION_NAME = {
  THEME: 'theme'
} as const
