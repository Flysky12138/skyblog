'use client'

import { MusicPlayListGetResponseType } from '@/app/api/music/neteasecloud/playlist/route'
import ModalMusic from '@/components/modal/ModalMusic'
import { CustomFetch } from '@/lib/server/fetch'
import { MusicNoteRounded } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { useAsync } from 'react-use'

const getPlaylist = async () => {
  return await CustomFetch<MusicPlayListGetResponseType>('/api/music/neteasecloud/playlist')
}

export default function Music() {
  const { loading, value } = useAsync(getPlaylist)

  if (loading) return null
  if (!value || value.length == 0) return null

  return (
    <ModalMusic
      component={props => (
        <Tooltip title="音乐">
          <IconButton {...props}>
            <MusicNoteRounded />
          </IconButton>
        </Tooltip>
      )}
      value={value}
    />
  )
}
