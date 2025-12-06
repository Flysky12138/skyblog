'use client'

import { motion, MotionProps } from 'framer-motion'

interface TransitionCollapseProps extends Omit<MotionProps, 'animate' | 'initial' | 'variants'> {
  /**
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

export function TransitionCollapse({ orientation = 'vertical', ...props }: TransitionCollapseProps) {
  return (
    <motion.div
      animate={`${orientation}-animate`}
      initial={`${orientation}-initial`}
      variants={{
        'horizontal-animate': {
          opacity: 1,
          overflow: 'visible',
          width: 'auto'
        },
        'horizontal-initial': {
          opacity: 0,
          width: 0
        },
        'vertical-animate': {
          height: 'auto',
          opacity: 1,
          overflow: 'visible'
        },
        'vertical-initial': {
          height: 0,
          opacity: 0
        }
      }}
      {...props}
    />
  )
}
