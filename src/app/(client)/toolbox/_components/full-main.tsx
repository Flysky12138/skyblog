import React from 'react'

export const FullMain = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-main bg-card">
      <style>{`
        main [data-slot="container"] { 
          padding: 0;
          max-width: none;
        }
      `}</style>
      {children}
    </div>
  )
}
