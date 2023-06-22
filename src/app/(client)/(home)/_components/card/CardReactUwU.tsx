'use client'

import react from '@/assets/lottie/react.json'
import Card from '@/components/layout/Card'
import TransitionCollapse from '@/components/transition/TransitionCollapse'
import Lottie from '@lottielab/lottie-player/react'

export default function CardReactUwU() {
  return (
    <Card component={TransitionCollapse}>
      <Lottie lottie={react} />
    </Card>
  )
}
