'use client'

import { cn } from '@/lib/cn'
import { Masonry as MuiMasonry, MasonryProps as MuiMasonryProps } from '@mui/lab'
import { useMeasure, useTimeout } from 'react-use'

export interface MasonryProps extends MuiMasonryProps {
  minWidth?: string
}

export default function Masonry({ className, children, columns, minWidth, spacing = 1, ...props }: MasonryProps) {
  const [ref, { width }] = useMeasure<HTMLElement>()
  if (minWidth) columns = (width / Number.parseFloat(minWidth)) >> 0

  // 避免瀑布流组件计算布局时页面抖动
  const [isReady] = useTimeout(1000)

  return (
    <MuiMasonry
      ref={ref}
      className={cn(
        'overflow-hidden transition-[height] [&>*]:opacity-100 [&>*]:transition-opacity [&>*]:duration-1000',
        {
          's-skeleton h-20 rounded [&>*]:invisible [&>*]:opacity-0': !isReady()
        },
        className
      )}
      columns={columns}
      component="figure"
      spacing={spacing}
      style={{
        paddingTop: `${Number(spacing) / 8}rem`
      }}
      {...props}
    >
      {children}
    </MuiMasonry>
  )
}
