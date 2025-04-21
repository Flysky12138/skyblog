'use client'

import react from '@/assets/lottie/react.json'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import dynamic from 'next/dynamic'
import React from 'react'

const Lottie = dynamic(() => import('@lottielab/lottie-player/react'), { ssr: false })

export const CardReactUwU = () => {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <DisplayByConditional
      condition={loaded}
      fallback={
        <Lottie
          className="hidden"
          lottie={react}
          onLoad={() => {
            setLoaded(true)
          }}
        />
      }
    >
      <Card asChild>
        <TransitionCollapse>
          <Lottie lottie={react} />
        </TransitionCollapse>
      </Card>
    </DisplayByConditional>
  )
}
