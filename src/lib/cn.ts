import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 `class` 针对于 `tailwindcss`
 */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))
