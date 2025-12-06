import { noop } from 'es-toolkit'
import React from 'react'

export const useBroadcastChannel = <T = any, D = any>(name: string, onMessage?: (data: T, channel: BroadcastChannel) => void) => {
  const channelRef = React.useRef<BroadcastChannel>(null)

  const handlerRef = React.useEffectEvent(onMessage || noop)

  React.useEffect(() => {
    if (!('BroadcastChannel' in window)) return

    const channel = new BroadcastChannel(name)
    channelRef.current = channel

    channel.onmessage = event => {
      handlerRef(event.data, channel)
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [name])

  const postMessage = React.useCallback((data: D) => {
    channelRef.current?.postMessage(data)
  }, [])

  return {
    postMessage
  }
}
