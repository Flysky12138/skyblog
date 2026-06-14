import { cn } from '@repo/ui/lib/utils'
import React from 'react'

export function table({ className, ...props }: React.ComponentProps<'table'>) {
  return <table className={cn('block overflow-auto', className)} {...props} />
}

export function tbody(props: React.ComponentProps<'tbody'>) {
  return <tbody {...props} />
}

export function td({ className, ...props }: React.ComponentProps<'td'>) {
  return <td className={cn('border px-4 whitespace-nowrap', className)} {...props} />
}

export function tfoot(props: React.ComponentProps<'tfoot'>) {
  return <tfoot {...props} />
}

export function th({ className, ...props }: React.ComponentProps<'th'>) {
  return <th className={cn('border border-b-2 px-4 py-2 whitespace-nowrap', className)} {...props} />
}

export function thead(props: React.ComponentProps<'thead'>) {
  return <thead {...props} />
}

export function tr({ className, ...props }: React.ComponentProps<'tr'>) {
  return <tr className={cn('even:bg-sheet', className)} {...props} />
}
