import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 `tailwindcss` 类名
 */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes))

/**
 * 定义 `className` 字符串，带 `tailwindcss` 类名提示
 */
export const tw = (classes: TemplateStringsArray) => cn(classes)

/**
 * 是否是开发环境
 */
export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV == 'development'

/**
 * 生成随机字符串
 */
export const randomString = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  const base = chars.length
  const max = Math.floor(256 / base) * base

  let result = ''
  const buffer = new Uint8Array(length * 2)

  while (result.length < length) {
    crypto.getRandomValues(buffer)
    for (let i = 0; i < buffer.length && result.length < length; i++) {
      const val = buffer[i]
      if (val < max) {
        result += chars[val % base]
      }
    }
  }

  return result
}
