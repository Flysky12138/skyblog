'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
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

  return (
    <pre ref={preRef} className={cn('relative', className)} {...props}>
      {children}
      <div className="absolute top-2.5 right-2 text-[initial]">
        <AnimatePresence>
          <DisplayByConditional
            condition={copied}
            fallback={
              <motion.div
                key={2}
                animate="visible"
                className="absolute top-0 right-0"
                exit="invisible"
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
              >
                <Clipboard size={20} />
              </motion.div>
            }
          >
            <motion.div key={1} animate="visible" className="absolute top-0 right-0" exit="invisible" initial="invisible" variants={variants}>
              <Check size={20} />
            </motion.div>
          </DisplayByConditional>
        </AnimatePresence>
      </div>
    </pre>
  )
}
