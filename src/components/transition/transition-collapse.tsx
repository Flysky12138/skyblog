'use client'

import { motion, MotionProps } from 'framer-motion'

interface TransitionCollapseProps extends Omit<MotionProps, 'animate' | 'initial' | 'variants'> {
  /**
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

export const TransitionCollapse = ({ orientation = 'vertical', ...props }: TransitionCollapseProps) => {
  return (
    <motion.div
      animate={`${orientation}-animate`}
      initial={`${orientation}-initial`}
      transition={{
        type: 'tween'
      }}
      variants={{
        'horizontal-animate': {
          opacity: 1,
          width: 'auto'
        },
        'horizontal-initial': {
          opacity: 0,
          width: 0
        },
        'vertical-animate': {
          height: 'auto',
          opacity: 1
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
