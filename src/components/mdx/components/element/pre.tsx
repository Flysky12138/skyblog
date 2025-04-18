'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Check, Clipboard } from 'lucide-react'
import React from 'react'
import { useCopyToClipboard } from 'react-use'

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
          'opacity-0 group-hover/pre:opacity-100 focus-visible:opacity-100'
        )}
        variant="outline"
        onClick={handleCopyClick}
      >
        <AnimatePresence initial={false}>
          <DisplayByConditional
            condition={copied}
            fallback={
              <motion.div key={2} animate="active" exit="inactive" initial="inactive" variants={variants}>
                <Clipboard />
              </motion.div>
            }
          >
            <motion.div key={1} animate="active" exit="inactive" initial="inactive" variants={variants}>
              <Check />
            </motion.div>
          </DisplayByConditional>
        </AnimatePresence>
      </Button>
    </pre>
  )
}
