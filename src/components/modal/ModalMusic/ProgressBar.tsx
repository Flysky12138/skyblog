'use client'

import { millisecondToTemplate } from '@/lib/parser/time'
import { Slider } from '@mui/joy'
import React from 'react'

export interface ProgressBarRefType {
  setProgress: (ms: number) => void
}
interface ProgressBarPropsType {
  maxValue: number
  onChange: (ms: number) => void
}

export default React.forwardRef<ProgressBarRefType, ProgressBarPropsType>(function ProgressBar({ maxValue, onChange }, ref) {
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
        { label: millisecondToTemplate(duration), value: 0 },
        { label: millisecondToTemplate(maxValue), value: maxValue }
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
      valueLabelFormat={value => millisecondToTemplate(value)}
      onChange={(_, value) => setDuration(value as number)}
      onChangeCommitted={(_, value) => onChange(value as number)}
    />
  )
})
