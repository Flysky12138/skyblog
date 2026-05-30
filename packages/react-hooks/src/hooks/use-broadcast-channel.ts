import React from 'react'

import { useLatestRef } from './use-latest-ref'

export const useBroadcastChannel = <T = any, D = any>(name: string, onMessage?: (data: T, channel: BroadcastChannel) => void) => {
  const channelRef = React.useRef<BroadcastChannel>(null)

  const onMessageRef = useLatestRef(onMessage)

  React.useEffect(() => {
    if (!('BroadcastChannel' in window)) return

    const channel = new BroadcastChannel(name)
    channelRef.current = channel

    channel.onmessage = event => {
      onMessageRef.current?.(event.data as T, channel)
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
