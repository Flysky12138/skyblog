'use client'

import { useOffline } from 'next/offline'

export function Offline() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <>
      <style>{`
        html {
          overflow: hidden;
        }
      `}</style>

      <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-md" role="status">
        Offline. Pending requests will retry once you are back online.
      </div>
    </>
  )
}
