'use client'

import { debounce, inRange } from 'es-toolkit'
import { Route } from 'next'
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { useEvent } from 'react-use'

import { HEADING_ATTRIBUTE } from '@/components/mdx/rehype/rehype-heading-level'
import { ATTRIBUTE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PostCatalogueProps extends React.ComponentProps<'section'> {
  children: React.ReactNode
}

export const PostCatalogue = ({ className, ref, ...props }: PostCatalogueProps) => {
  const ulRef = React.useRef<HTMLUListElement>(null)

  const setActiveItemStyle = React.useEffectEvent((activeIndex: number) => {
    const container = ulRef.current
    if (!container) return
    Array.from(container.querySelectorAll('a[href^="#"]')).forEach((el, i) => {
      activeIndex == i ? el.setAttribute('data-active', '') : el.removeAttribute('data-active')
      if (activeIndex != i) return
      const { offsetHeight: parentHeight, scrollTop } = container
      const { offsetHeight, offsetTop } = el as HTMLElement
      if (!inRange(offsetTop - scrollTop, offsetHeight + 20, parentHeight - offsetHeight - 20)) {
        container.scroll({ behavior: 'smooth', top: offsetTop - parentHeight * 0.5 })
      }
    })
  })

  const handleFindActiveItem = debounce(() => {
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

  useEvent('scroll', handleFindActiveItem)

  return (
    <ul
      ref={ulRef}
      aria-label="post catalogue"
      className={cn(
        'hidden empty:hidden lg:block',
        'scrollbar-hidden font-article w-52 shrink-0 space-y-1.5 self-start overflow-auto p-3 pr-1.5',
        'sticky top-[calc(var(--height-header)+--spacing(9))] max-h-[calc(100dvh-var(--height-header)---spacing(18))]',
        className
      )}
      data-slot="post-catalogue"
      {...props}
    />
  )
}

export const PostCatalogueHeading = ({ children, className, id, ...props }: Omit<LinkProps<never>, 'href'>) => {
  const depth = Reflect.get(props, HEADING_ATTRIBUTE).split('.').length - 1

  return (
    <li>
      <Link
        replace
        className={cn(
          'relative block rounded-md py-1 pr-2',
          'data-active:text-link-foreground data-active:bg-link',
          'data-active:before:bg-link-foreground/60 data-active:before:absolute data-active:before:inset-y-1 data-active:before:-left-2 data-active:before:w-1 data-active:before:rounded-md',
          'hover:text-link-foreground hover:bg-link/30',
          className
        )}
        href={`#${id}` as Route}
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
