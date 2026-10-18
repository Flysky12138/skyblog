import { clamp, pick } from 'es-toolkit'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

const ExtList = [
  { ext: 'jpg', mimeType: 'image/jpeg', name: 'JPEG' },
  { ext: 'webp', mimeType: 'image/webp', name: 'WEBP' }
] as const satisfies {
  /**
   * 输出文件扩展名
   */
  ext: string
  /**
   * 输出图片格式
   */
  mimeType: string
  name: string
}[]

interface ImageCompressionStore {
  ext: string
  extList: typeof ExtList
  quality: number
  setExt: (ext: null | string) => void
  setQuality: (quality: number) => void
}

function middleware(fn: StateCreator<ImageCompressionStore>) {
  return persist(fn, {
    name: 'image-compression',
    version: 1,
    partialize: state => pick(state, ['ext', 'quality'])
  })
}

export const useImageCompressionStore = create<ImageCompressionStore>()(
  middleware((set, get) => ({
    ext: 'webp',
    extList: ExtList,
    quality: 70,
    setExt: ext => set({ ext: ext ?? 'webp' }),
    setQuality: quality => set({ quality: clamp(quality, 1, 100) })
  }))
)
