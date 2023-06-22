import { EDGE_CONFIG } from '@/lib/constants'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomResponse } from '@/lib/server/response'
import { get } from '@vercel/edge-config'

export const runtime = 'edge'

export const GET = async () => {
  const id = await get<number>(EDGE_CONFIG.NETEASECLOUD_PLAYLIST_ID)
  if (!id) return CustomResponse.error('{id} 值缺失', 422)

  try {
    const data = await CustomFetch(`${process.env.API_NETEASECLOUDMUSIC}/playlist/track/all?id=${id}`)

    // @ts-ignore
    const songs = data.songs.map(song => ({
      ar: song.ar.map(({ name }: { name: string }) => name),
      dt: song.dt,
      id: song.id,
      name: song.name,
      picUrl: song.al.picUrl
    }))

    return CustomResponse.encrypt(songs)
  } catch (error) {
    return CustomResponse.error(error)
  }
}

export type MusicPlayListGetResponseType = Array<{
  ar: string[]
  dt: number
  id: number
  name: string
  picUrl: string
}>
