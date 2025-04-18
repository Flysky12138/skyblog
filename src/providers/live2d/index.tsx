'use client'

import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { get } from '@/server/edge-config'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, BotOff, Loader2 } from 'lucide-react'
import { Live2DModel } from 'pixi-live2d-display'
import React from 'react'
import { useAsync, useInterval, useLocalStorage } from 'react-use'
import styles from './live2d.module.css'
import { initGlobalScript, loadModelSync, PADDING } from './utils'

interface MessageDetail {
  /** 文本内容 */
  content: string | null
  /**
   * 权重，大的覆盖小的
   * @default 0
   */
  priority?: number
  /**
   * 显示时间 ms
   * @default 6000
   */
  timeout?: number
}

interface Live2DContextProps {
  /** 开关 */
  enable?: boolean
  /** 加载中 */
  loading: boolean
  /** 消息 */
  message: MessageDetail['content']
  setEnable: React.Dispatch<Live2DContextProps['enable']>
  setLoading: React.Dispatch<Live2DContextProps['loading']>
  setMessage: React.Dispatch<MessageDetail>
  setSrc: React.Dispatch<Live2DContextProps['src']>
  /** 地址 */
  src?: string
}

const Live2DContext = React.createContext<Live2DContextProps>(null!)

export const useLive2DContext = () => React.useContext(Live2DContext)

export const Live2DProvider = ({ children }: React.PropsWithChildren) => {
  const [enable, setEnable] = useLocalStorage('live2d-enable', false)
  const [loading, setLoading] = React.useState(false)
  const [src, setSrc] = React.useState<Live2DContextProps['src']>()

  // 获取 src
  useAsync(async () => {
    const _src = await get<string>(VERCEL_EDGE_CONFIG.LIVE2D_SRC)
    setSrc(_src)
  }, [])

  // 消息
  const timer = React.useRef<NodeJS.Timeout>(undefined)
  const [messageDetail, setMessageDetail] = React.useState<MessageDetail>({ content: null })
  const setMessage = React.useCallback<Live2DContextProps['setMessage']>(
    ({ content, priority = 0, timeout = 6000 }) => {
      if (priority < (messageDetail.priority || 0)) return
      clearTimeout(timer.current)
      setMessageDetail({ content, priority, timeout })
      timer.current = setTimeout(() => {
        setMessageDetail({ content: null, priority: 0, timeout: 6000 })
      }, timeout)
    },
    [messageDetail.priority]
  )

  // 网络语消息显示
  useInterval(async () => {
    if (!enable || loading) return
    const data = await CustomRequest('GET api/phrase', {})
    if (!data.hitokoto) return
    setMessage({ content: data.hitokoto, priority: 1 })
  }, 1000 * 30)

  return (
    <Live2DContext.Provider
      value={{
        enable,
        loading,
        setEnable,
        setLoading,
        setMessage,
        setSrc,
        src,
        message: messageDetail.content
      }}
    >
      {children}
    </Live2DContext.Provider>
  )
}

export const Live2DBreakpoint = (props: React.PropsWithChildren) => {
  return <DisplayByBreakPoint down="lg" {...props} />
}

export const Live2DToggleButton = () => {
  const { enable, setEnable, loading, src } = useLive2DContext()

  if (!src) return null

  return (
    <Live2DBreakpoint>
      <Button disabled={loading} size="icon" variant="outline" onClick={() => setEnable(!enable)}>
        <DisplayByConditional condition={loading} fallback={enable ? <Bot /> : <BotOff />}>
          <Loader2 className="animate-spin" />
        </DisplayByConditional>
      </Button>
    </Live2DBreakpoint>
  )
}

const Live2DContent_ = () => {
  const [model, setModel] = React.useState<Live2DModel>()
  const { enable, loading, message, src, setEnable, setLoading } = useLive2DContext()

  // 模型加载
  useAsync(async () => {
    if (!enable || !src) return
    try {
      setLoading(true)
      await initGlobalScript()
      const _model = await loadModelSync(src)
      setModel(_model)
      _model?.on('hit', hitAreas => {
        if (hitAreas.includes('breast_l')) _model.textures.push(_model.textures.shift()!)
        if (hitAreas.includes('breast_r')) _model.motion('breast', 0)
      })
    } catch (error) {
      setEnable(false)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [enable, src])

  // 创建容器，并装载模型
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    if (!model || !canvasRef.current) return
    const app = new window.PIXI!.Application({
      antialias: true,
      autoDensity: true,
      autoStart: true,
      backgroundAlpha: 0,
      height: model.height + PADDING.y * 2,
      resolution: window.devicePixelRatio,
      view: canvasRef.current,
      width: model.width + PADDING.x * 2
    })
    app.stage.addChild(model)
    // 鼠标离开窗口后，让人物正视前方
    const listener = () => model.focus(app.renderer.view.width / 2, (app.renderer.view.height - PADDING.y) / 3)
    document.documentElement.addEventListener('pointerleave', listener)
    return () => {
      document.documentElement.removeEventListener('pointerleave', listener)
      app?.destroy(true, true)
    }
  }, [model])

  return (
    <DisplayByConditional condition={enable && !loading}>
      <motion.section
        animate={{
          opacity: 1,
          x: 0
        }}
        className="z-nav fixed bottom-0 cursor-grab select-none"
        initial={{
          opacity: 0,
          x: '-100%'
        }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          type: 'tween'
        }}
      >
        <AnimatePresence>
          {message && (
            <motion.p
              key={message}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className={cn(
                'absolute -top-12 left-24 w-max max-w-xs rounded-xl px-3 py-1 backdrop-blur-xs',
                'pointer-events-none text-sm break-all text-fuchsia-700 dark:text-white',
                'dark:border-opacity-30 border border-orange-300',
                'bg-orange-300/20 dark:bg-yellow-200/20',
                'shadow-[1px_3px_5px] shadow-orange-300/20',
                styles.message
              )}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} className="dark:brightness-75"></canvas>
      </motion.section>
    </DisplayByConditional>
  )
}

export const Live2DContent = () => {
  return (
    <Live2DBreakpoint>
      <Live2DContent_ />
    </Live2DBreakpoint>
  )
}
