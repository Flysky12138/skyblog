import React from 'react'

import { Style } from '@/components/utils/style'

export const FullMain = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-main bg-card">
      <Style>{`
        main [data-slot="container"] { 
          padding: 0;
          max-width: none;
        }
      `}</Style>
      {children}
    </div>
  )
}
