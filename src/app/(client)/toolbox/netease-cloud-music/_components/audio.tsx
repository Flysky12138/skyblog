import React from 'react'
import { useAudio } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { Portal } from '@/components/layout/portal'
import { CustomRequest } from '@/lib/http/request'
import { isDev } from '@/lib/utils'

export interface AudioProps {
  id?: number
  ref?: React.RefObject<null | {
    controls: ReturnType<typeof useAudio>[2]
  }>
  onPausedChange?: (paused: boolean) => void
}

export const Audio = ({ id, ref, onPausedChange }: AudioProps) => {
  const { data: src } = useSWR(
    id ? ['0198f641-f60c-720d-98c2-69a4f880a373', 'standard', id] : null,
    async () => {
      const [song] = await CustomRequest('GET /api/netease-cloud-music/song/url', { search: { id: id!, level: 'standard' } })
      if (song.url) return song.url
      toast.error('获取音频失败')
      return ''
    },
    {
      fallbackData: '',
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const [audio, { paused }, controls] = useAudio({
    src: isDev() ? src : src.replace('http:', 'https:'),
    onCanPlay: () => {
      controls.play()
    }
  })

  React.useEffect(() => {
    onPausedChange?.(paused)
  }, [onPausedChange, paused])

  React.useImperativeHandle(ref, () => ({ controls }), [controls])

  return <Portal container={document.body}>{audio}</Portal>
}
