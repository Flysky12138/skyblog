'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Bot, BotOff } from 'lucide-react'
import { JSONObject, Live2DModel, ModelSettings } from 'pixi-live2d-display'
import React from 'react'
import { useInterval } from 'react-use'

import { DisplayByBreakPoint, DisplayByBreakPointProps } from '@/components/display/display-by-breakpoint'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromiseDelay } from '@/lib/toast'
import { cn } from '@/lib/utils'

import styles from './index.module.css'
import { initGlobalScript, loadModel, PADDING } from './utils'

declare global {
  interface Window {
    PIXI?: typeof import('pixi.js') & {
      live2d?: typeof import('pixi-live2d-display')
    }
  }
}

interface Live2DContextProps {
  isEnabled: boolean
  isLoading: boolean
  message: Message['content']
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setSource: React.Dispatch<Live2DContextProps['source']>
  source?: JSONObject | ModelSettings | null | string
  setMessage: (msg: Message) => void
}

interface Message {
  content: null | string
  /**
   * 优先级，数值越大优先级越高
   * @default 0
   */
  priority?: number
  /**
   * 显示时长，单位毫秒
   * @default 6000
   */
  timeout?: number
}

const Live2DContext = React.createContext<Live2DContextProps | null>(null)

export const useLive2DContext = () => {
  const context = React.useContext(Live2DContext)
  if (!context) {
    throw new Error('useLive2DContext must be used within Live2DProvider')
  }
  return context
}

export function Live2DContent() {
  return (
    <Live2DBreakpoint>
      <Live2DContentInner />
    </Live2DBreakpoint>
  )
}

export function Live2DProvider({ children }: React.PropsWithChildren) {
  const [isEnabled, setIsEnabled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [source, setSource] = React.useState<Live2DContextProps['source']>()

  // source 获取
  React.useEffect(() => {
    let ignore = false

    rpc['edge-config'].get
      .get({ query: { key: VERCEL_EDGE_CONFIG_KEY.LIVE2D_SRC } })
      .then(unwrap)
      .then(src => !ignore && setSource(src))
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [])

  // message system
  const timerRef = React.useRef<NodeJS.Timeout>(undefined)
  const messageRef = React.useRef<Message>({ content: null })
  const [messageState, setMessageState] = React.useState<Message>({
    content: null
  })

  const setMessage = React.useCallback(({ content, priority = 0, timeout = 6000 }: Message) => {
    if (priority < (messageRef.current.priority ?? 0)) return

    clearTimeout(timerRef.current)

    const next = { content, priority, timeout }
    messageRef.current = next
    setMessageState(next)

    timerRef.current = setTimeout(() => {
      messageRef.current = { content: null }
      setMessageState({ content: null })
    }, timeout)
  }, [])

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  // hitokoto interval
  useInterval(
    async () => {
      if (!isEnabled || isLoading) return
      try {
        const data = await rpc.phrase.get().then(unwrap)
        data?.hitokoto && setMessage({ content: data.hitokoto, priority: 1 })
      } catch {}
    },
    isEnabled ? 30_000 : null
  )

  const value = React.useMemo(
    () => ({
      isEnabled,
      isLoading,
      message: messageState.content,
      setIsEnabled,
      setIsLoading,
      setMessage,
      setSource,
      source
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEnabled, isLoading, messageState.content, source]
  )

  return <Live2DContext.Provider value={value}>{children}</Live2DContext.Provider>
}

export function Live2DToggleButton() {
  return (
    <Live2DBreakpoint>
      <Live2DToggleButtonInner />
    </Live2DBreakpoint>
  )
}

function Live2DBreakpoint(props: DisplayByBreakPointProps) {
  return <DisplayByBreakPoint min="lg" {...props} />
}

function Live2DContentInner() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const [model, setModel] = React.useState<Live2DModel>()

  const { isEnabled, isLoading, setIsEnabled, setIsLoading, source } = useLive2DContext()

  // model load
  React.useEffect(() => {
    if (!isEnabled || !source) return

    let ignore = false

    void (async () => {
      try {
        setIsLoading(true)
        await toastPromiseDelay(initGlobalScript(), {
          error: 'Failed to initialize Live2D environment',
          id: '019b2566-b670-73bd-a442-289f9eb7ae2a',
          loading: 'Initializing Live2D environment...'
        })

        if (ignore) return

        const m = await toastPromiseDelay(loadModel(source), {
          error: 'Failed to load Live2D Model',
          id: '019b2566-b670-73bd-a442-289f9eb7ae2a',
          loading: 'Loading Live2D Model...'
        })
        m.on('hit', areas => {
          if (areas.includes('breast_l')) {
            m.textures.push(m.textures.shift()!)
          }
          if (areas.includes('breast_r')) {
            m.motion('breast', 0)
          }
        })
        setModel(m)
      } catch (error) {
        console.error(error)
        setIsEnabled(false)
      } finally {
        if (ignore) return
        setIsLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [isEnabled, source, setIsEnabled, setIsLoading])

  // pixi mount
  React.useEffect(() => {
    if (!model || !canvasRef.current) return

    const app = new window.PIXI!.Application({
      autoDensity: true,
      autoStart: true,
      backgroundAlpha: 0,
      height: model.height + PADDING.y * 2,
      resolution: window.devicePixelRatio,
      view: canvasRef.current,
      width: model.width + PADDING.x * 2
    })

    app.stage.addChild(model)

    const onLeave = () => {
      model.focus(model.x + model.width / 2, model.y + model.height / 2)
    }
    document.documentElement.addEventListener('pointerleave', onLeave)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sectionRef.current?.classList.remove('-translate-x-full', 'opacity-0')
      })
    })

    return () => {
      document.documentElement.removeEventListener('pointerleave', onLeave)
      model.destroy()
      app.destroy()
    }
  }, [model])

  return (
    <DisplayByConditional condition={isEnabled && !isLoading}>
      <section
        ref={sectionRef}
        aria-label="live2d model"
        className={cn(
          'fixed bottom-0 z-20 cursor-grab select-none',
          '-translate-x-full opacity-0 transition-[opacity,translate] duration-[1000ms,700ms] ease-in'
        )}
      >
        <MessageContent className="absolute -top-12 left-24 z-10" />
        <div className="border border-dashed transition-[backdrop-filter] not-hover:border-transparent hover:backdrop-blur-sm">
          <canvas ref={canvasRef} className="dark:brightness-75" />
        </div>
      </section>
    </DisplayByConditional>
  )
}

function Live2DToggleButtonInner() {
  const { isEnabled, isLoading, setIsEnabled, source } = useLive2DContext()

  if (!source) return null

  return (
    <TransitionCollapse orientation="horizontal">
      <Button
        aria-label="live2d toggle"
        aria-pressed={!isLoading && isEnabled}
        disabled={isLoading}
        size="icon"
        variant="outline"
        onClick={() => setIsEnabled(v => !v)}
      >
        <DisplayByConditional condition={isLoading} fallback={isEnabled ? <Bot /> : <BotOff />}>
          <Spinner />
        </DisplayByConditional>
      </Button>
    </TransitionCollapse>
  )
}

function MessageContent({ className }: { className?: string }) {
  const { message } = useLive2DContext()

  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key={message}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className={cn(
            className,
            'pointer-events-none w-max max-w-xs rounded-xl px-3 py-1 text-sm break-all',
            'border border-orange-300 bg-orange-300/20 backdrop-blur-xs',
            'text-fuchsia-700 shadow-[1px_3px_5px] shadow-orange-300/20',
            'dark:border-opacity-30 dark:bg-yellow-200/20 dark:text-white',
            styles.message
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
