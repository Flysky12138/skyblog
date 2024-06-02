'use client'

import lottie from '@/assets/lottie/react.json'
import Card from '@/components/layout/Card'
import Collapse from '@/components/transitions/Collapse'
import Lottie from '@lottielab/lottie-player/react'

export default function ReactUwU() {
  return (
    <Card component={Collapse}>
      <Lottie autoplay className="[&_g[clip-path]>g:nth-child(2)]:!hidden" lottie={lottie} />
    </Card>
  )
}
