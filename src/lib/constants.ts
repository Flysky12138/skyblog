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
 * key of `window.sessionStorage`
 */
export const SESSIONSTORAGE_KEY = {
  POST_VIEW_SUBMITTED: (id: string) => `post-view-submitted-${id}` as const
} as const

/**
 * 请求/响应头 key
 */
export const HEADER_KEY = {
  AES_GCM_IVJWK: 'X-Aes'
} as const

/**
 * key of vercel edge config store
 */
export const VERCEL_EDGE_CONFIG_KEY = {
  /** live2d 直链 */
  LIVE2D_SRC: 'live2d-src',
  /** 网易云音乐 cookie */
  NETEASE_CLOUD_MUSIC_COOKIE: 'netease-cloud-music-cookie'
} as const

/**
 * 文章详情页卡片可见性控制编码
 */
export enum POST_CARD_VISIBILITY_MASK {
  HEADER = 1 << 0,
  TOC = 1 << 1,
  COMMENT = 1 << 2
}

/**
 * 缓存标签
 */
export const CACHE_TAG = {
  FRIENDS: 'friends',
  POSTS: 'posts',
  EDGE_CONFIG: {
    NETEASE_CLOUD_MUSIC_COOKIE: 'netease-cloud-music-cookie'
  },
  FRIEND: (id: string) => `friend-${id}` as const,
  POST: (id: string) => `post-${id}` as const
} as const

/**
 * 存储仓库
 */
export const STORAGE = {
  ROOT_DIRECTORY_ID: '019b8eed-833a-7785-acc2-06d8768bd6d6'
} as const
