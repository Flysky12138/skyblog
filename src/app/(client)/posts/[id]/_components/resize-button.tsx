'use client'

import { Expand, Shrink } from 'lucide-react'
import React from 'react'
import { useToggle } from 'react-use'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
          [data-slot="post-abstract"],
          [data-slot="post-catalogue"] {
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
        aria-label="resize toggle"
        className={cn('size-7', className)}
        size="icon"
        variant="ghost"
        onClick={() => {
          isFullPageToggle()
          document.documentElement.classList.toggle('post-full-page', !isFullPage)
        }}
        {...props}
      >
        {isFullPage ? <Shrink /> : <Expand />}
      </Button>
    </>
  )
}
