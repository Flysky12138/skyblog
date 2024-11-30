/** 请求头 */
export const HEADER = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

/** cookie */
export const COOKIE = {
  VISITED: 'visited'
} as const

/** edge 对象 key */
export const EDGE_CONFIG = {
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

/** `useSwr` cahce key，页面间共享数据时使用 */
export const SWR_KEY = {
  CLASH_TEMPLATES: '01930ee7-da43-7eac-b940-98f1627d2f3f'
} as const

/** css `view-transition-name` */
export const VIEW_TRANSITION_NAME = {
  THEME: 'theme'
} as const
