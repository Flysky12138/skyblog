'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Check, Clipboard } from 'lucide-react'
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

export const Pre = ({ children, className, tabIndex, ...props }: React.ComponentProps<'pre'>) => {
  const [_, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)

  const preRef = React.useRef<HTMLPreElement>(null)
  const handleCopyClick = () => {
    if (copied) return
    const code = preRef.current?.textContent
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
      <Button
        className={cn(
          'absolute top-1 right-1 size-8 p-2 text-[initial] md:top-1.5 md:right-1.5',
          'dark:bg-stone-800 hover:dark:bg-stone-900',
          'opacity-0 transition-opacity group-hover/pre:opacity-100 focus-visible:opacity-100'
        )}
        variant="outline"
        onClick={handleCopyClick}
      >
        <AnimatePresence initial={false}>
          <DisplayByConditional
            condition={copied}
            fallback={
              <motion.div key={2} animate="visible" exit="invisible" initial="invisible" variants={variants}>
                <Clipboard />
              </motion.div>
            }
          >
            <motion.div key={1} animate="visible" exit="invisible" initial="invisible" variants={variants}>
              <Check />
            </motion.div>
          </DisplayByConditional>
        </AnimatePresence>
      </Button>
    </pre>
  )
}
