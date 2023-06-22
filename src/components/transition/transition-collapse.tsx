'use client'

import { motion, MotionProps } from 'framer-motion'

interface TransitionCollapseProps extends Omit<MotionProps, 'initial' | 'animate'> {}

export const TransitionCollapse = (props: TransitionCollapseProps) => {
  return (
    <motion.section
      animate={{
        height: 'auto',
        opacity: 1
      }}
      initial={{
        height: 0,
        opacity: 0
      }}
      transition={{
        type: 'tween'
      }}
      {...props}
    />
  )
}
