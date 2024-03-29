'use client'

import { Live2DGetResponseType } from '@/app/api/dashboard/live2d/route'
import Breakpoint from '@/components/layout/Breakpoint'
import { CustomFetch } from '@/lib/server/fetch'
import React from 'react'
import { useAsync, useInterval, useLocalStorage } from 'react-use'
import { useImmer } from 'use-immer'

interface Live2DContextProps {
  enable?: boolean
  loading: boolean
  message: { content: string | null; priority?: number; timeout?: number }
  setEnable: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setMessage: React.Dispatch<Live2DContextProps['message']>
  src?: string
}

export const Live2DContext = React.createContext<Live2DContextProps>({
  enable: false,
  loading: false,
  message: { content: null },
  setEnable: () => null,
  setLoading: () => null,
  setMessage: () => null
})

export const Live2DProvider = ({ children }: { children: React.ReactNode }) => {
  const [enable, setEnable] = useLocalStorage('live2d', false)
  const [src, setSrc] = React.useState<Live2DContextProps['src']>()
  const [loading, setLoading] = React.useState(false)

  // Live2D 资源地址
  useAsync(async () => {
    const data = await CustomFetch<Live2DGetResponseType>('/api/live2d')
    setSrc(data.src)
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
    try {
      const data = await CustomFetch('/api/phrase')
      if (!data.hitokoto) return
      setMessage({ content: data.hitokoto, priority: 100 })
    } catch (error) {
      console.error(error)
    }
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

// 开关
export const Live2DEnable = ({ children }: { children: React.ReactNode }) => {
  const { enable } = React.useContext(Live2DContext)
  return <>{enable ? children : null}</>
}

// 断点
export const Live2DBreakpoint = ({ children }: { children: React.ReactNode }) => {
  return <Breakpoint up="xl">{children}</Breakpoint>
}
