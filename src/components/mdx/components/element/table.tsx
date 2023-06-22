import { cn } from '@/lib/cn'
import React from 'react'

export const table = ({ className, ...props }: React.ComponentProps<'table'>) => {
  return <table className={cn('block overflow-auto', className)} {...props} />
}

export const thead = ({ className, ...props }: React.ComponentProps<'thead'>) => {
  return <thead className={className} {...props} />
}

export const tbody = ({ className, ...props }: React.ComponentProps<'tbody'>) => {
  return <tbody className={className} {...props} />
}

export const tfoot = ({ className, ...props }: React.ComponentProps<'tfoot'>) => {
  return <tfoot className={className} {...props} />
}

export const tr = ({ className, ...props }: React.ComponentProps<'tr'>) => {
  return <tr className={cn('even:bg-sheet', className)} {...props} />
}

export const th = ({ className, ...props }: React.ComponentProps<'th'>) => {
  return <th className={cn('border border-b-2 px-4 py-2 whitespace-nowrap', className)} {...props} />
}

export const td = ({ className, ...props }: React.ComponentProps<'td'>) => {
  return <td className={cn('border px-4 whitespace-nowrap', className)} {...props} />
}
