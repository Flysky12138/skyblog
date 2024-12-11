'use client'

import useLive2D from '@/hooks/useLive2D'
import { cn } from '@/lib/cn'
import { useLive2DContext } from '@/provider/live2d'
import { delay } from 'es-toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import './live2d.css'

export default function Live2D() {
  const containerRef = React.useRef<HTMLElement>(null)
  const { setLoading, setEnable, message, src } = useLive2DContext()

  const { live2dRef, model } = useLive2D(src, {
    model: {
      onError: () => {
        setEnable(false)
        setLoading(false)
      },
      onLoad: async () => {
        await delay(500) // 让电脑缓缓再显示，防止卡顿掉帧
        containerRef.current?.classList.remove('-translate-x-full', 'opacity-0')
        setLoading(false)
        setEnable(true)
      }
    }
  })

  model?.on('hit', hitAreas => {
    if (hitAreas.includes('breast_l')) model.textures.push(model.textures.shift()!)
    if (hitAreas.includes('breast_r')) model.motion('breast', 0)
  })

  return (
    <AnimatePresence>
      <section ref={containerRef} aria-label="waifu" className="fixed bottom-0 z-nav -translate-x-full cursor-grab select-none opacity-0" id="waifu">
        {message.content ? (
          <motion.p
            key={message.content}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className={cn([
              'absolute -top-12 left-24 w-max max-w-xs rounded-xl px-3 py-1 backdrop-blur-sm',
              'pointer-events-none break-all text-sm text-fuchsia-700 dark:text-white',
              'border border-orange-300 dark:border-opacity-30',
              'bg-orange-300/20 dark:bg-yellow-200/20',
              'shadow-[1px_3px_5px] shadow-orange-300/20'
            ])}
            exit={{ opacity: 0 }}
            id="waifu-message"
            initial={{ opacity: 0 }}
          >
            {message.content}
          </motion.p>
        ) : null}
        <canvas ref={live2dRef} className="dark:brightness-75"></canvas>
      </section>
    </AnimatePresence>
  )
}
