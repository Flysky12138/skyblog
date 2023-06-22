'use client'

import { CustomFetch } from '@/lib/server/fetch'
import { SWRConfig } from 'swr'

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: url => CustomFetch(url)
      }}
    >
      {children}
    </SWRConfig>
  )
}
