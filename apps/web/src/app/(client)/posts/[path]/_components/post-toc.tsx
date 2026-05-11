'use client'

import { useEvent } from '@repo/react-hooks'
import { cn } from '@repo/ui/lib/utils'
import { debounce, inRange } from 'es-toolkit'
import Link from 'next/link'
import React from 'react'

import { ATTRIBUTE } from '@/lib/constants'

interface PostTocProps extends React.ComponentProps<'section'> {
  children: React.ReactNode
}

export function PostToc({ className, ref, ...props }: PostTocProps) {
  const ulRef = React.useRef<HTMLUListElement>(null)

  const setActiveItemStyle = React.useEffectEvent((activeIndex: number) => {
    const ul = ulRef.current
    if (!ul) return
    Array.from(ul.querySelectorAll('a[href^="#"]')).forEach((el, i) => {
      activeIndex == i ? el.setAttribute('data-active', '') : el.removeAttribute('data-active')
      if (activeIndex != i) return
      const { offsetHeight: parentHeight, scrollTop } = ul
      const { offsetHeight, offsetTop } = el as HTMLElement
      const minimum = offsetHeight + 20
      const maximum = parentHeight - minimum
      if (minimum >= maximum) return
      // 判断是否在可视范围内
      if (!inRange(offsetTop - scrollTop, minimum, maximum)) {
        ul.scroll({ behavior: 'smooth', top: offsetTop - parentHeight * 0.5 })
      }
    })
  })

  const handleFindActiveItem = React.useEffectEvent(
    debounce(() => {
      const article = document.getElementById(ATTRIBUTE.ID.POST_CONTAINER)
      if (!article) return
      const rects = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6'), it => it.getBoundingClientRect())
      const [min, max] = [0, 200]
      for (let i = 0; i < rects.length; i++) {
        if (
          // 第一个标题大于最大范围
          (i == 0 && rects[i].top > max) ||
          // 范围内
          inRange(rects[i].top, min, max) ||
          // 指定的范围在两标题之间
          (i + 1 < rects.length && rects[i].top < min && rects[i + 1].top > max) ||
          // 最后一个标题小于最小范围
          (i + 1 == rects.length && rects[i].top < min)
        ) {
          setActiveItemStyle(i)
          break
        }
      }
    }, 60)
  )

  useEvent('scroll', handleFindActiveItem)

  return (
    <ul
      ref={ulRef}
      aria-label="post toc"
      className={cn(
        'hidden empty:hidden lg:block',
        'w-52 space-y-1.5 p-3 pe-1.5',
        'no-scrollbar shrink-0 self-start overflow-auto font-article',
        'sticky top-[calc(var(--height-header)+(--spacing(9)))] max-h-[calc(100dvh-var(--height-header)-(--spacing(18)))]',
        className
      )}
      data-slot="post-toc"
      {...props}
    />
  )
}

export function PostTocHeading({ children, className, id, ...props }: Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const str = Reflect.get(props, 'data-level') as string | undefined
  const depth = (str?.split('.').length ?? 1) - 1

  return (
    <li>
      <Link
        replace
        className={cn(
          'relative block rounded-md py-1 pe-2',
          'data-active:bg-link/60 data-active:text-link-foreground',
          'data-active:before:absolute data-active:before:inset-y-1 data-active:before:-inset-s-2 data-active:before:w-1 data-active:before:rounded-md data-active:before:bg-link-foreground/50',
          'hover:bg-link/40 hover:text-link-foreground',
          'focus-visible:text-link-foreground focus-visible:ring-3',
          className
        )}
        href={`#${id}`}
        style={{
          paddingLeft: `${0.5 + depth}rem`
        }}
        {...props}
      >
        <span className="block truncate text-sm font-semibold">{children}</span>
      </Link>
    </li>
  )
}
