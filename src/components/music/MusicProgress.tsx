'use client'

import { formatMillisecond } from '@/lib/parser/time'
import { Slider } from '@mui/joy'
import React from 'react'

export interface MusicProgressRef {
  setProgress: (ms: number) => void
}
interface MusicProgressProps {
  maxValue: number
  onChange: (ms: number) => void
}

export default React.forwardRef<MusicProgressRef, MusicProgressProps>(function MusicProgress({ maxValue, onChange }, ref) {
  const [duration, setDuration] = React.useState(0)

  // 手动控制中
  const [control, setControl] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    setProgress: value => {
      React.startTransition(() => {
        if (control) return
        setDuration(value)
      })
    }
  }))

  return (
    <Slider
      aria-label="播放进度"
      marks={[
        { label: formatMillisecond(duration), value: 0 },
        { label: formatMillisecond(maxValue), value: maxValue }
      ]}
      max={maxValue}
      min={0}
      size="sm"
      slotProps={{
        root: {
          onPointerDown: () => setControl(true),
          onPointerUp: () => setControl(false)
        }
      }}
      value={duration}
      valueLabelDisplay="auto"
      valueLabelFormat={value => formatMillisecond(value)}
      onChange={(_, value) => setDuration(value as number)}
      onChangeCommitted={(_, value) => onChange(value as number)}
    />
  )
})
