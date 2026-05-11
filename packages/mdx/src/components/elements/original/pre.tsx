'use client'

import { useCopyToClipboard } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'
import React from 'react'

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

  React.useEffect(() => {
    setCopyText(preRef.current?.querySelector('code')?.textContent)
  }, [])

  const [_, copy] = useCopyToClipboard()
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
    <pre ref={preRef} className={cn('group/pre relative rounded-none bg-sheet p-0', className)} {...props}>
      {children}
      {copyText && (
        <Button
          aria-label="copy code"
          className={cn(
            'text-[initial]',
            'absolute inset-e-1 top-1 md:inset-e-1.5 md:top-1.5',
            'opacity-0 group-hover/pre:opacity-100 focus-visible:opacity-100'
          )}
          size="icon-sm"
          variant="outline"
          onClick={handleCopyClick}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={copied ? '1' : '0'} animate="active" exit="inactive" initial="inactive" variants={variants}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </motion.div>
          </AnimatePresence>
        </Button>
      )}
    </pre>
  )
}
