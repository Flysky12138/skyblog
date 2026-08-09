'use client'

import { toast } from '@repo/ui/base'
import { useOffline } from 'next/offline'
import React from 'react'

export function Offline() {
  const isOffline = useOffline()

  React.useEffect(() => {
    if (!isOffline) return

    const id = toast.warning('当前处于离线状态，请检查网络连接', {
      dismissible: false,
      duration: Infinity,
      richColors: true
    })

    return () => {
      toast.dismiss(id)
    }
  }, [isOffline])

  return null
}
