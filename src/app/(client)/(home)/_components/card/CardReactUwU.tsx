'use client'

import lottie from '@/assets/lottie/react.json'
import Card from '@/components/layout/Card'
import TransitionCollapse from '@/components/transition/TransitionCollapse'
import Lottie from '@lottielab/lottie-player/react'

export default function CardReactUwU() {
  return (
    <Card component={TransitionCollapse}>
      <Lottie autoplay className="[&_g[clip-path]>g:nth-child(2)]:!hidden" lottie={lottie} />
    </Card>
  )
}
