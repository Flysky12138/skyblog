'use client'

import { MusicPlayListGetResponseType } from '@/app/api/music/neteasecloud/playlist/route'
import ModalCore from '@/components/modal/ModalCore'
import MusicCard from '@/components/music'
import { CustomFetch } from '@/lib/server/fetch'
import { MusicNoteRounded } from '@mui/icons-material'
import { IconButton, ModalClose, Tooltip } from '@mui/joy'
import { useAsync } from 'react-use'

const getPlaylist = async () => {
  return await CustomFetch<MusicPlayListGetResponseType>('/api/music/neteasecloud/playlist')
}

export default function Music() {
  const { loading, value } = useAsync(getPlaylist)

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
      <MusicCard value={value} />
    </ModalCore>
  )
}
