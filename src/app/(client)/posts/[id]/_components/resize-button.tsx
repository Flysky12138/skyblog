'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { Expand, Shrink } from 'lucide-react'
import React from 'react'
import { useToggle } from 'react-use'

interface ResizeButtonProps extends React.ComponentProps<typeof Button> {}

export const ResizeButton = ({ className, ...props }: ResizeButtonProps) => {
  const [isFullPage, isFullPageToggle] = useToggle(false)

  return (
    <>
      {isFullPage && (
        <style>{`
          article {
            border: 0;
            border-radius: 0;
            overflow: auto;
            height: 100vh;
          }
          header, footer,
          [data-slot="post-header"],
          [data-slot="post-toc"] {
            display: none;
          }
          main {
            margin: 0;
            border: 0;
          }
          .container {
            padding: 0;
            max-width: unset;
          }
      `}</style>
      )}
      <Button
        className={cn('size-7', className)}
        size="icon"
        variant="ghost"
        onClick={() => {
          isFullPageToggle()
          window.dispatchEvent(new Event('resize'))
          document.documentElement.classList.toggle('post-full-page', !isFullPage)
        }}
        {...props}
      >
        {isFullPage ? <Shrink /> : <Expand />}
      </Button>
    </>
  )
}
