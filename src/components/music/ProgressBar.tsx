'use client'

import { formatMillisecond } from '@/lib/parser/time'
import { Slider } from '@mui/joy'
import React from 'react'

export interface ProgressBarRef {
  setProgress: (ms: number) => void
}
interface ProgressBarProps {
  maxValue: number
  onChange: (ms: number) => void
}

export default React.forwardRef<ProgressBarRef, ProgressBarProps>(function ProgressBar({ maxValue, onChange }, ref) {
  const [duration, setDuration] = React.useState(0)

  // 手动控制中
  const [control, setControl] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    setProgress: value => {
      React.startTransition(() => {
        if (!control) {
          setDuration(value)
        }
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
