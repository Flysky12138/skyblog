'use client'

import { cn } from '@/lib/cn'
import { ContentPaste, Done } from '@mui/icons-material'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import React from 'react'
import { useCopyToClipboard } from 'react-use'

const variants: Variants = {
  invisible: {
    opacity: 0,
    scale: 0.2
  },
  visible: {
    opacity: 1,
    scale: 1
  }
}

export default function Pre({ children, className, tabIndex, ...props }: React.ComponentProps<'pre'>) {
  const [_, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)

  const preRef = React.useRef<HTMLPreElement>(null)

  return (
    <pre ref={preRef} className={cn('group', className)} {...props}>
      {children}
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <AnimatePresence>
          {copied ? (
            <Done animate="visible" color="success" component={motion.svg} exit="invisible" fontSize="medium" initial="invisible" variants={variants} />
          ) : (
            <ContentPaste
              animate="visible"
              color="primary"
              component={motion.svg}
              exit="invisible"
              fontSize="medium"
              initial="invisible"
              role="button"
              variants={variants}
              onClick={() => {
                const code = preRef.current?.textContent
                if (!code) return
                copy(code)
                setCopied(true)
                setTimeout(() => {
                  setCopied(false)
                }, 2000)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </pre>
  )
}
