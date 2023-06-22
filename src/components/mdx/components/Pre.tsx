'use client'

import { cn } from '@/lib/cn'
import { CopyAll, ExpandLess, LibraryAddCheckRounded } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { motion } from 'framer-motion'
import React from 'react'
import { useCopyToClipboard } from 'react-use'

export default function Pre({ children, className, ...props }: React.ComponentProps<'pre'>) {
  const figureRef = React.useRef<HTMLElement>(null)
  const preRef = React.useRef<HTMLPreElement>(null)

  // copy
  const [_, copy] = useCopyToClipboard()
  const [isCopied, setIsCopied] = React.useState(false)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isCopied) setIsCopied(false)
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [isCopied])

  // @ts-ignore
  const defaultExpanded = (children?.props?.children?.length || 0) > 30

  return (
    <figure
      ref={figureRef}
      className="group s-divider relative overflow-hidden rounded-lg border aria-expanded:max-h-80"
      {...(defaultExpanded && {
        'aria-expanded': defaultExpanded
      })}
    >
      <IconButton
        aria-label="Copy"
        className={cn('absolute right-1 top-1 z-10 rounded-lg opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100', {
          'pointer-events-none': isCopied
        })}
        color={isCopied ? 'success' : 'neutral'}
        variant="outlined"
        onClick={() => {
          const code = preRef.current?.textContent
          if (!code) return
          copy(code)
          setIsCopied(true)
        }}
      >
        {isCopied ? (
          <LibraryAddCheckRounded animate={{ scale: 1 }} component={motion.svg} initial={{ scale: 0.5 }} />
        ) : (
          <CopyAll animate={{ scale: 1 }} className="outline-none" component={motion.svg} initial={{ scale: 0.5 }} tabIndex={-1} whileTap={{ scale: 0.5 }} />
        )}
      </IconButton>
      <pre
        ref={preRef}
        className={cn(
          'rounded-inherit',
          {
            'pb-8': defaultExpanded
          },
          className
        )}
        {...props}
      >
        {children}
      </pre>
      {defaultExpanded && (
        <div className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-center bg-gradient-to-b from-transparent to-white to-70% dark:to-[#1f1e1e]">
          <ExpandLess
            className="cursor-pointer group-aria-expanded:rotate-180"
            onClick={() => {
              if (!figureRef.current) return
              figureRef.current.ariaExpanded = figureRef.current.ariaExpanded == 'true' ? 'false' : 'true'
            }}
          />
        </div>
      )}
    </figure>
  )
}
