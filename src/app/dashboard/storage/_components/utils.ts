/**
 * SWR key for storage list
 */
export const STORAGE_LIST_SWR_KEY = (id: string) => ['019b6af1-3ebe-7088-bfac-a8847e7b5a9f', id] as const

/**
 * 上传文件分片大小，10M
 */
export const PART_SIZE = 10 * 1024 * 1024

/**
 * 获取 S3 直链
 */
export const getPublicUrl = (key: string) => `${process.env.NEXT_PUBLIC_R2_URL.replace(/\/$/, '')}/${key}`
