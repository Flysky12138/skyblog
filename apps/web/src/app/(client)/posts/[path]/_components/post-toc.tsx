'use client'

import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import React from 'react'

import { ATTRIBUTE } from '@/lib/constants'

interface PostTocProps extends React.ComponentProps<'section'> {
  children: React.ReactNode
}

export function PostToc({ className, ref, ...props }: PostTocProps) {
  const ulRef = React.useRef<HTMLUListElement>(null)

  const activeIndexRef = React.useRef(-1)

  const setActiveItemStyle = (activeIndex: number) => {
    if (activeIndexRef.current === activeIndex) return
    activeIndexRef.current = activeIndex

    const ul = ulRef.current
    if (!ul) return

    const links = Array.from(ul.querySelectorAll<HTMLAnchorElement>('a[data-level]'))

    links.forEach((link, i) => {
      if (i === activeIndex) {
        link.setAttribute('data-active', '')
      } else {
        link.removeAttribute('data-active')
      }
    })

    const activeEl = links[activeIndex]
    if (!activeEl) return

    const { offsetHeight: parentHeight, scrollTop } = ul
    const { offsetHeight, offsetTop } = activeEl

    const minimum = offsetHeight + 20
    const maximum = parentHeight - minimum

    if (minimum >= maximum) return

    const current = offsetTop - scrollTop

    if (current < minimum || current > maximum) {
      ul.scroll({
        behavior: 'smooth',
        top: offsetTop - parentHeight * 0.5
      })
    }
  }

  React.useEffect(() => {
    const article = document.getElementById(ATTRIBUTE.ID.POST_CONTAINER)
    if (!article) return

    const headings = Array.from(article.querySelectorAll('h1,h2,h3,h4,h5,h6'))

    if (!headings.length) return

    const visible = new Map<number, number>()

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const index = headings.indexOf(entry.target)

          if (entry.isIntersecting) {
            visible.set(index, entry.boundingClientRect.top)
          } else {
            visible.delete(index)
          }
        }

        if (!visible.size) return

        const activeIndex = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0]

        requestAnimationFrame(() => {
          setActiveItemStyle(activeIndex)
        })
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    )

    headings.forEach(heading => observer.observe(heading))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ul
      ref={ulRef}
      className={cn(
        'hidden empty:hidden lg:block',
        'w-52 space-y-1.5 p-3 pe-1.5',
        'no-scrollbar shrink-0 self-start overflow-auto font-article',
        'sticky top-[calc(var(--height-header)+(--spacing(9)))] max-h-[calc(100dvh-var(--height-header)-(--spacing(18)))]',
        className
      )}
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
