'use client'

import { ScaleBox } from '@repo/components/scale-box'
import { useWindowSize } from 'react-use'

import { AudioPlayer, AudioPlayerProps } from '@/components/audio-player'

interface AutosizeAudioPlayerProps extends AudioPlayerProps {}

export function AutosizeAudioPlayer(props: AutosizeAudioPlayerProps) {
  const { height } = useWindowSize()

  return (
    <ScaleBox maxHeight={Math.min(720, height - 48)} scaleType="transform">
      <AudioPlayer {...props} />
    </ScaleBox>
  )
}
