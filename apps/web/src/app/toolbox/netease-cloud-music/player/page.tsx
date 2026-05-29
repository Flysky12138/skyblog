import { Metadata } from 'next'

import { AudioPlayer } from './_components/audio-player'
import { getLyric, getSongDetails, getSongUrl } from './utils'

export const generateMetadata = async ({ searchParams }: PageProps<'/toolbox/netease-cloud-music/player'>): Promise<Metadata> => {
  const { id } = (await searchParams) as { id: string }

  const [song, url] = await Promise.all([getSongDetails(id), getSongUrl(id)])

  return {
    description: undefined,
    openGraph: {
      duration: Math.round(song.dt / 1000),
      images: [{ url: song.al.picUrl.replace('http:', 'https:') + '?param=720y720' }],
      musicians: song.ar.map(a => a.name),
      type: 'music.song',
      url
    },
    title: {
      absolute: `${song.name} - ${song.ar[0].name}`
    }
  }
}

export default async function Page({ searchParams }: PageProps<'/toolbox/netease-cloud-music/player'>) {
  const { id } = (await searchParams) as { id: string }

  const [song, url, lyric] = await Promise.all([getSongDetails(id), getSongUrl(id), getLyric(id)])

  return <AudioPlayer className="w-full overflow-hidden rounded-lg shadow-xs" lyric={lyric} song={song} url={url} />
}
