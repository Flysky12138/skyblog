import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 `tailwindcss` 类名
 */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes))

/**
 * 定义 `className` 字符串，带 `tailwindcss` 类名提示
 */
export const tw = (classes: TemplateStringsArray) => twMerge(clsx(classes))

/**
 * 是否是开发环境
 */
export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV == 'development'
