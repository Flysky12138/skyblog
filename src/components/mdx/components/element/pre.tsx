'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Check, Clipboard } from 'lucide-react'
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

export const Pre = ({ children, className, tabIndex, ...props }: React.ComponentProps<'pre'>) => {
  const [_, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)

  const preRef = React.useRef<HTMLPreElement>(null)
  const handleCopyClick = () => {
    if (copied) return
    const code = preRef.current?.querySelector('code')?.textContent
    if (!code) return
    copy(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <pre ref={preRef} className={cn('group/pre relative', className)} {...props}>
      {children}
      <div
        className={cn(
          'flex items-center justify-center gap-1 md:gap-1.5',
          'absolute top-1 right-1 md:top-1.5 md:right-1.5',
          'opacity-0 group-hover/pre:opacity-100 focus-visible:opacity-100'
        )}
      >
        <Button
          aria-label="copy code"
          className="p-2 text-[initial] dark:bg-stone-800 hover:dark:bg-stone-900"
          size="icon-sm"
          variant="outline"
          onClick={handleCopyClick}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={copied ? 'check' : 'clipboard'} animate="active" exit="inactive" initial="inactive" variants={variants}>
              {copied ? <Check /> : <Clipboard />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </pre>
  )
}
