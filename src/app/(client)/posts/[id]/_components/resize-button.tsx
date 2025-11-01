'use client'

import { Expand, Shrink } from 'lucide-react'
import React from 'react'
import { useEvent, useToggle } from 'react-use'

import { Button } from '@/components/ui/button'
import { ATTRIBUTE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ResizeButtonProps extends React.ComponentProps<typeof Button> {}

export const ResizeButton = ({ className, ...props }: ResizeButtonProps) => {
  const [isFullPage, isFullPageToggle] = useToggle(false)

  const placeholderRef = React.useRef<HTMLElement>(null)
  const scrollTop = React.useRef(0)

  const handleClick = () => {
    const article = document.getElementById(ATTRIBUTE.ID.POST_CONTAINER)
    if (!article) return

    if (isFullPage) {
      placeholderRef.current?.replaceWith(article)
      requestAnimationFrame(() => {
        document.documentElement.scrollTop = scrollTop.current
      })
    } else {
      scrollTop.current = document.documentElement.scrollTop
      const div = document.createElement('div')
      placeholderRef.current = div
      div.ariaHidden = 'true'
      article.replaceWith(div)
      document.body.prepend(article)
    }
    isFullPageToggle()
  }

  useEvent('keydown', event => {
    if (isFullPage && event.key == 'Escape') {
      handleClick()
    }
  })

  return (
    <>
      {isFullPage && (
        <style>{`
          article {
            border: 0;
            border-radius: 0;
            overflow: auto;
            height: 100vh;
            z-index: 9999;
          }
          body>*:not(#${ATTRIBUTE.ID.POST_CONTAINER}) {
            display: none;
          }
        `}</style>
      )}
      <Button aria-label="resize toggle" className={cn('size-7', className)} size="icon" variant="ghost" onClick={handleClick} {...props}>
        {isFullPage ? <Shrink /> : <Expand />}
      </Button>
    </>
  )
}
