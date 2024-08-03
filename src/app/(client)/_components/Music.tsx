'use client'

import ModalCore from '@/components/modal/ModalCore'
import MusicCard from '@/components/music'
import { CustomRequest } from '@/lib/server/request'
import { MusicNoteRounded } from '@mui/icons-material'
import { IconButton, ModalClose, Tooltip } from '@mui/joy'
import { useAsync } from 'react-use'

export default function Music() {
  const { loading, value } = useAsync(async () => {
    return await CustomRequest('GET api/music/neteasecloud/playlist', {})
  })

  if (loading) return null
  if (!value || value.length == 0) return null

  return (
    <ModalCore
      disableBackdropClickClose
      keepMounted
      className="overflow-hidden rounded-xl p-0"
      component={props => (
        <Tooltip title="音乐">
          <IconButton {...props}>
            <MusicNoteRounded />
          </IconButton>
        </Tooltip>
      )}
    >
      <ModalClose className="rounded-full bg-transparent" />
      <MusicCard
        playlist={value}
        onLoad={({ id }) =>
          Promise.all([
            CustomRequest('GET api/music/neteasecloud/song', { search: { id } }),
            CustomRequest('GET api/music/neteasecloud/lyric', { search: { id } })
          ]).then(([song, lyrics]) => ({
            lyrics,
            url: song.url
          }))
        }
      />
    </ModalCore>
  )
}
