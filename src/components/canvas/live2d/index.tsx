'use client'

import './live2d.css'

import { cn } from '@/lib/cn'
import { sleep } from '@/lib/sleep'
import { Live2DContext } from '@/provider/live2d'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import live2d from './live2d'

const live2dInit = async (view: HTMLCanvasElement, path?: string) => {
  if (!path) throw new Error()

  const { app, model } = await live2d({ hitAreaVisible: false, path, px: 10, py: 10, view })

  model.on('hit', hitAreas => {
    if (hitAreas.includes('breast_l')) model.toggle()
    if (hitAreas.includes('breast_r')) model.motion('breast', 0)
  })

  return () => {
    app?.destroy(true, true)
  }
}

export default function Live2D() {
  const containerRef = React.useRef<HTMLElement>(null)
  const live2dRef = React.useRef<HTMLCanvasElement>(null)

  const live2dDestroy = React.useRef<() => void>()

  const { setLoading, setEnable, message, src } = React.useContext(Live2DContext)

  // 初始化
  React.useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        if (!live2dRef.current) throw new Error()
        live2dDestroy.current = await live2dInit(live2dRef.current, src)
        await sleep(500) // 让电脑缓缓再显示，防止卡顿掉帧
        containerRef.current?.classList.remove('-translate-x-full', 'opacity-0')
      } catch (error) {
        setEnable(false)
      }
      setLoading(false)
    })()
    return () => {
      live2dDestroy.current?.()
    }
  }, [setLoading, setEnable, src])

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
