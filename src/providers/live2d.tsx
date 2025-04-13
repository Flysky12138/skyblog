'use client'

import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { get } from '@/server/edge-config'
import React from 'react'
import { useAsync, useInterval, useLocalStorage } from 'react-use'
import { useImmer } from 'use-immer'

interface Live2DContextProps {
  /** 开关 */
  enable?: boolean
  /** 加载中 */
  loading: boolean
  /** 消息 */
  message: {
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
  setEnable: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setMessage: React.Dispatch<Live2DContextProps['message']>
  /** 模型资源 */
  src?: string
}

const Live2DContext = React.createContext<Live2DContextProps>(null!)

export const useLive2DContext = () => React.useContext(Live2DContext)

export const Live2DProvider = ({ children }: React.PropsWithChildren) => {
  const [enable, setEnable] = useLocalStorage('live2d', false)
  const [loading, setLoading] = React.useState(false)

  // Live2D 资源地址
  const [src, setSrc] = React.useState<Live2DContextProps['src']>()
  useAsync(async () => {
    try {
      const src = await get<string>(VERCEL_EDGE_CONFIG.LIVE2D_SRC)
      if (!src) throw new Error()
      setSrc(src)
    } catch (error) {
      setEnable(false)
      setLoading(false)
    }
  })

  // 消息
  const timer = React.useRef<NodeJS.Timeout | undefined>(undefined)
  const [message, changeMessage] = useImmer<Live2DContextProps['message']>({ content: null })
  const setMessage = React.useCallback<Live2DContextProps['setMessage']>(
    ({ content, priority = 0, timeout = 6000 }) => {
      if (priority < (message.priority || 0)) return
      clearTimeout(timer.current)
      changeMessage({ content, priority, timeout })
      timer.current = setTimeout(() => {
        changeMessage({ content: null, priority: 0, timeout: 6000 })
      }, timeout)
    },
    [changeMessage, message.priority]
  )

  // 网络语消息显示
  const phraseMessage = React.useCallback(async () => {
    if (!enable || loading) return
    const data = await CustomRequest('GET api/phrase', {})
    if (!data.hitokoto) return
    setMessage({ content: data.hitokoto, priority: 100 })
  }, [enable, loading, setMessage])
  useInterval(phraseMessage, 1000 * 30)

  return (
    <Live2DContext.Provider
      value={{
        enable,
        loading,
        message,
        setEnable,
        setLoading,
        setMessage,
        src
      }}
    >
      {children}
    </Live2DContext.Provider>
  )
}

/**
 * 开关
 */
export const Live2DEnable = ({ children }: React.PropsWithChildren) => {
  const { enable } = React.useContext(Live2DContext)
  return <>{enable ? children : null}</>
}

/**
 * 断点
 */
export const Live2DBreakpoint = (props: React.PropsWithChildren) => {
  return <DisplayByBreakPoint down="lg" {...props} />
}
