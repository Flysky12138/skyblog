'use client'

import { useEvent, useScrollbarWidth, useToggle } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { ExpandIcon, ShrinkIcon } from 'lucide-react'
import React from 'react'

import { Style } from '@/components/style'
import { ATTRIBUTE } from '@/lib/constants'

interface PostResizeButtonProps extends React.ComponentProps<typeof Button> {}

export function PostResizeButton({ className, ...props }: PostResizeButtonProps) {
  const scrollBarWidth = useScrollbarWidth()
  const [isFullPage, isFullPageToggle] = useToggle(false)

  const placeholderRef = React.useRef<HTMLElement>(null)
  const scrollTop = React.useRef(0)

  const handleClick = () => {
    const article = document.getElementById(ATTRIBUTE.ID.POST_CONTAINER)
    if (!article) return

    if (isFullPage) {
      placeholderRef.current?.replaceWith(article)
      window.requestAnimationFrame(() => {
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

  useEvent('keydown', (event: KeyboardEvent) => {
    if (isFullPage && event.key === 'Escape') {
      handleClick()
    }
  })

  return (
    <>
      {isFullPage && (
        <Style>{`
          :root {
            --scrollbar-width: ${scrollBarWidth ?? 0}px;
          }
          #${ATTRIBUTE.ID.POST_CONTAINER} {
            border: 0;
            border-radius: 0;
            overflow: auto;
            height: 100vh;
            z-index: 9999;
          }
          body>*:not(#${ATTRIBUTE.ID.POST_CONTAINER}) {
            display: none;
          }
        `}</Style>
      )}
      <Button
        aria-label="resize toggle"
        aria-pressed={isFullPage}
        className={cn('size-7', className)}
        size="icon"
        variant="secondary"
        {...props}
        onClick={handleClick}
      >
        {isFullPage ? <ShrinkIcon /> : <ExpandIcon />}
      </Button>
    </>
  )
}
