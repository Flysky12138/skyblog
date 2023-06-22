'use client'

import lottie from '@/assets/lottie/react.json'
import Card from '@/components/layout/Card'
import Lottie from '@lottielab/lottie-player/react'

export default function ReactUwU() {
  return (
    <Card className="aspect-[5/3] overflow-clip">
      <Lottie autoplay className="[&_g[clip-path]>g:nth-child(2)]:!hidden" lottie={lottie} />
    </Card>
  )
}
