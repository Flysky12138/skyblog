import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 `class` 针对于 `tailwindcss`
 */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes))

/**
 * 带提示，定义 `className` 字符串
 */
export const tw = (classes: TemplateStringsArray) => twMerge(clsx(classes))
