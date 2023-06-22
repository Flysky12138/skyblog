import { AlbumResponseType, SongUrlQueryType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'

export type LevelType = NonNullable<SongUrlQueryType['level']>

export const LEVEL_OPTIONS: { label: string; value: LevelType }[] = [
  { label: '超清母带 20M~180M', value: 'jymaster' },
  { label: '沉浸环绕声 20M~80M', value: 'sky' },
  { label: '高清臻音 20M~100M', value: 'jyeffect' },
  { label: '高解析度无损 30M', value: 'hires' },
  { label: '无损 10~30M', value: 'lossless' },
  { label: '极高 5~10M', value: 'exhigh' },
  // { label: '较高', value: 'higher' },
  { label: '标准 2~5M', value: 'standard' }
]

export const REMOVE_ARTIST_BY_NAMES = ['杰伦', '杰倫', '蔡健雅', '曲婉婷']

export const songCanDownload = (song: AlbumResponseType['songs'][number]) => {
  if (song.pc) return true
  if (song.privilege.fee == 0) return true
  if (song.privilege.payed) return true
  return false
}
