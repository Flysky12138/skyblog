'use client'

import { useCopy } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { delay } from 'es-toolkit'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { AnimatePresence, motion, Variants } from 'motion/react'
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
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const [copyText, setCopyText] = React.useState<string>()

  React.useEffect(() => {
    setCopyText(preRef.current?.querySelector('code')?.textContent)
  }, [])

  const { copy, isCopied } = useCopy({
    timeout: 2000,
    onCopy: () => {
      buttonRef.current?.classList.add('opacity-100')
    },
    onEnd: async () => {
      await delay(500)
      buttonRef.current?.classList.remove('opacity-100')
    }
  })

  return (
    <pre ref={preRef} className={cn('group/pre relative overflow-clip rounded-inherit bg-sheet p-0', className)} {...props}>
      {children}
      {copyText && (
        <Button
          ref={buttonRef}
          aria-label="copy code"
          className={cn(
            'rounded-sm text-[initial]',
            'absolute top-2 right-2',
            'opacity-0 duration-300 group-hover/pre:opacity-100 focus-visible:opacity-100'
          )}
          size="icon-xs"
          variant="outline"
          onClick={() => {
            copy(copyText)
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={isCopied ? '1' : '0'} animate="active" exit="inactive" initial="inactive" variants={variants}>
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </motion.div>
          </AnimatePresence>
        </Button>
      )}
    </pre>
  )
}
