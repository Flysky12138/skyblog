'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'
import React from 'react'
import { useCopyToClipboard } from 'react-use'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const variants: Variants = {
  active: {
    opacity: 1,
    scale: 1
  },
  inactive: {
    opacity: 0,
    scale: 0.2
  }
}

export function Pre({ children, className, tabIndex, ...props }: React.ComponentProps<'pre'>) {
  const preRef = React.useRef<HTMLPreElement>(null)

  const [copied, setCopied] = React.useState(false)
  const [copyText, setCopyText] = React.useState<string>()

  const [_, copy] = useCopyToClipboard()

  React.useEffect(() => {
    setCopyText(preRef.current?.querySelector('code')?.textContent)
  }, [])

  const handleCopyClick = React.useEffectEvent(() => {
    if (copied) return
    if (!copyText) return
    copy(copyText)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  })

  return (
    <pre ref={preRef} className={cn('group/pre bg-sheet relative p-0', className)} {...props}>
      {children}
      {copyText && (
        <div
          className={cn(
            'flex items-center justify-center gap-1 md:gap-1.5',
            'absolute top-1 right-1 md:top-1.5 md:right-1.5',
            'opacity-0 group-hover/pre:opacity-100 has-[>:focus-visible]:opacity-100'
          )}
        >
          <Button aria-label="copy code" className="text-[initial]" size="icon-sm" variant="outline" onClick={handleCopyClick}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div key={copied ? 'check' : 'clipboard'} animate="active" exit="inactive" initial="inactive" variants={variants}>
                {copied ? <CheckIcon /> : <CopyIcon />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </div>
      )}
    </pre>
  )
}
