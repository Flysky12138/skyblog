/**
 * 请求头
 */
export const HEADER = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

/**
 * edge 对象 key
 */
export const VERCEL_EDGE_CONFIG = {
  /** live2d 直链 */
  LIVE2D_SRC: 'live2d-src',
  /** 网易云音乐 cookie */
  NETEASE_CLOUD_MUSIC_COOKIE: 'netease-cloud-music-cookie'
} as const

/**
 * 元素 attribute
 */
export const ATTRIBUTE = {
  ID: {
    NAV_CONTAINER: 'nav-container',
    POST_CONTAINER: 'post-container'
  }
} as const

/**
 * `window.sessionStorage` key
 */
export const SESSIONSTORAGE = {
  POST_VIEW_SUBMITTED: (id: string) => `post-view-submitted-${id}`
} as const

/**
 * post card display
 */
export enum POST_CARD_DISPLAY {
  HEADER = 1 << 0,
  ISSUES = 1 << 2,
  TOC = 1 << 1
}
