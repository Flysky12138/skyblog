/** 请求头 */
export const HEADER = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

/** cookie */
export const COOKIE = {
  VISITED: 'visited'
} as const

/** edge 对象 key */
export const VERCEL_EDGE_CONFIG = {
  LIVE2D_SRC: 'live2d-src'
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
  POST_VIEW_SUBMITTED: (id: string) => `post-view-submitted-${id}`
} as const

/** css `view-transition-name` */
export const VIEW_TRANSITION_NAME = {
  THEME: 'theme'
} as const

/** post card display */
export enum POST_CARD_DISPLAY {
  HEADER = 1 << 0,
  TOC = 1 << 1,
  ISSUES = 1 << 2
}
