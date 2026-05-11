import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export * from 'class-variance-authority'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
