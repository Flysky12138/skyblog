'use client'

import { useLive2DContext } from '@/provider/live2d'
import { FaceRetouchingOffRounded, FaceRounded } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'

export default function ToggleLive2D() {
  const { enable, setEnable, loading, src } = useLive2DContext()

  if (!src) return null

  return (
    <Tooltip title={enable ? 'Live2D 关' : 'Live2D 开'}>
      <IconButton disabled={loading} onClick={() => setEnable(!enable)}>
        {enable ? <FaceRetouchingOffRounded /> : <FaceRounded />}
      </IconButton>
    </Tooltip>
  )
}
