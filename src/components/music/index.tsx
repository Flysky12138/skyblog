import Loop from '@/components/svg-icon/Loop'
import Random from '@/components/svg-icon/Random'
import { cn } from '@/lib/cn'
import { KeyboardDoubleArrowRight, Pause, PlayArrow, Refresh, SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { AnimatePresence, motion } from 'framer-motion'
import { Draft } from 'immer'
import Image from 'next/image'
import React from 'react'
import { useAsync } from 'react-use'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'
import MusicLyric, { MusicLyricRef } from './MusicLyric'
import MusicPlaylist from './MusicPlaylist'
import MusicProgress, { MusicProgressRef } from './MusicProgress'

/** 歌词类型 */
export type LyricModeType = 'lrc' | 'klyric' | 'tlyric' | 'romalrc'
/** 歌曲播放模式 */
type SongModeType = 'loop' | 'order' | 'random'
/** 歌词内容 */
export type LyricType = { lyric: string; time: number }
/** 歌单列表 */
export type PlaylistType = {
  ar: string[]
  dt: number
  id: number
  name: string
  picUrl: string
}

interface Player<T extends PlaylistType> {
  lyric: {
    loading: boolean
    mode: LyricModeType | null
    values: Partial<Record<LyricModeType, LyricType[] | null>>
  }
  song: {
    loading: boolean
    mode: SongModeType
    playing: boolean
    url?: string | null
    value: T
  }
}

interface MusicProps<T extends PlaylistType> {
  onLoad: (payload: T) => Promise<{
    lyrics: Player<T>['lyric']['values']
    url: Player<T>['song']['url']
  }>
  playlist: T[]
}

export default function Music<T extends PlaylistType>({ playlist, onLoad }: MusicProps<T>) {
  /** 播放器 */
  const audioRef = React.useRef<HTMLAudioElement>(null)
  /** 进度条 */
  const progressBarRef = React.useRef<MusicProgressRef>(null)
  /** 歌词 */
  const lyricRef = React.useRef<MusicLyricRef>(null)

  const [player, setPlayer] = useImmer<Player<T>>({
    lyric: {
      loading: false,
      mode: null,
      values: {}
    },
    song: {
      loading: false,
      mode: 'order',
      playing: false,
      value: playlist[0]
    }
  })

  /** 乱序歌单列表 */
  const playlistRandom = React.useMemo(() => Array.from(playlist).sort(() => Math.random() - 0.5), [playlist])

  /** 切歌 */
  const songsToggle = (payload: 'previous' | 'next' | number) => {
    let ans: T
    if (typeof payload == 'number') {
      ans = playlist[payload]
    } else {
      const step = Reflect.get({ next: 1, previous: -1 }, payload)
      let playIndex = (player.song.mode == 'random' ? playlistRandom : playlist).indexOf(player.song.value)
      playIndex = (playIndex + step + playlist.length) % playlist.length
      ans = (player.song.mode == 'random' ? playlistRandom : playlist)[playIndex]
    }
    setPlayer(state => {
      state.song.loading = true
      state.song.playing = true
      state.song.value = ans as Draft<T>
    })
  }

  // 获取歌曲链接、歌词
  useAsync(async () => {
    if (playlist.length == 0) return
    setPlayer(state => {
      state.song.url = null
    })
    progressBarRef.current?.setProgress(0)
    try {
      const { url, lyrics } = await onLoad(player.song.value)
      if (!url) throw `《${player.song.value.name}》地址获取失败`
      setPlayer(state => {
        state.song.url = url
        state.lyric.values = lyrics
      })
    } catch (error) {
      toast.warning(error as string)
      songsToggle('next')
    }
  }, [player.song.value])

  return (
    <section
      className={cn(
        'h-[600px] max-h-[calc(100dvh-theme(height.header))] w-[calc(100vw-40px)] max-w-lg',
        'flex flex-col overflow-hidden rounded-lg bg-white dark:bg-stone-900'
      )}
    >
      {/* 播放器 */}
      {player.song.url && (
        <audio
          key={player.song.url}
          ref={audioRef}
          loop={player.song.mode == 'loop' || playlist.length <= 1}
          src={player.song.url}
          onCanPlay={() => {
            setPlayer(state => {
              state.song.loading = false
            })
            if (player.song.playing) {
              audioRef.current?.play()
            }
          }}
          onEnded={() => songsToggle('next')}
          onError={() => {
            toast.error(`《${player.song.value.name}》加载失败`)
            setTimeout(() => songsToggle('next'), 5000)
          }}
          onTimeUpdate={event => {
            const second = (event.target as HTMLAudioElement).currentTime
            progressBarRef.current?.setProgress(second * 1000)
            lyricRef.current?.setProgress(second)
          }}
        />
      )}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={player.song.value.id}
          animate={{ opacity: 1 }}
          className="relative grow select-none dark:brightness-75"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {/* 封面 */}
          <Image fill unoptimized alt={player.song.value.name} className="object-cover" src={player.song.value.picUrl} />
          {/* 歌词 */}
          <MusicLyric ref={lyricRef} className="absolute inset-x-0 bottom-0" value={player.lyric.mode ? player.lyric.values[player.lyric.mode] : null} />
        </motion.div>
      </AnimatePresence>
      <div className="px-5 py-4">
        {/* 歌名 */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={player.song.value.id}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-x-2 whitespace-nowrap"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: -20 }}
          >
            <p className="shrink-0 overflow-hidden font-title text-xl">{player.song.value.name}</p>
            <p className="truncate text-sm opacity-60">{player.song.value.ar.join('/')}</p>
          </motion.div>
        </AnimatePresence>
        {/* 进度条 */}
        <MusicProgress
          ref={progressBarRef}
          maxValue={player.song.value.dt}
          onChange={value => {
            if (!audioRef.current) return
            audioRef.current.currentTime = value / 1000
          }}
        />
        {/* 控制器 */}
        <div className="mt-3 grid grid-cols-3 items-center">
          <div className="jspace-x-2 ustify-self-start">
            {/* 歌词切换 */}
            {player.lyric.values.lrc && (
              <IconButton
                className={cn('rounded-full', {
                  'line-through decoration-2': !player.lyric.mode
                })}
                color="neutral"
                variant="plain"
                onClick={() => {
                  setPlayer(state => {
                    const modes = Array.from<LyricModeType | null>(['lrc', 'tlyric', 'romalrc', 'klyric'])
                      .filter(it => it && state.lyric.values[it])
                      .concat(null)
                    if (modes.length <= 1) return
                    const useIndex = modes.findIndex(it => it == state.lyric.mode)
                    state.lyric.mode = modes.concat(modes)[useIndex + 1]
                  })
                }}
              >
                {Reflect.get({ klyric: '字', lrc: '词', romalrc: '音', tlyric: '译' } satisfies Record<LyricModeType, string>, player.lyric.mode || 'lrc')}
              </IconButton>
            )}
          </div>
          <div className="flex items-center gap-x-3 justify-self-center sm:gap-x-5">
            {/* 上一首 */}
            <IconButton className="rounded-full" disabled={playlist.length <= 1} onClick={() => songsToggle('previous')}>
              <SkipPrevious />
            </IconButton>
            {/* 播放、暂停 */}
            <IconButton
              className="rounded-full"
              disabled={player.song.loading && !player.song.playing}
              size="md"
              variant="solid"
              onClick={() => {
                setPlayer(state => {
                  state.song.playing = !state.song.playing
                })
                audioRef.current?.[player.song.playing ? 'pause' : 'play']()
              }}
            >
              {player.song.loading ? <Refresh className="animate-spin" /> : player.song.playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            {/* 下一首 */}
            <IconButton className="rounded-full" disabled={playlist.length <= 1} onClick={() => songsToggle('next')}>
              <SkipNext />
            </IconButton>
          </div>
          <div className="space-x-2 justify-self-end">
            {/* 播放模式 */}
            <IconButton
              className="rounded-full"
              color="neutral"
              disabled={playlist.length <= 1}
              variant="plain"
              onClick={() => {
                setPlayer(state => {
                  state.song.mode = Reflect.get(
                    { loop: 'order', order: 'random', random: 'loop' } satisfies Record<SongModeType, SongModeType>,
                    player.song.mode
                  )
                })
              }}
            >
              {Reflect.get(
                { loop: <Loop />, order: <KeyboardDoubleArrowRight />, random: <Random /> } satisfies Record<SongModeType, React.ReactNode>,
                player.song.mode
              )}
            </IconButton>
            {/* 播放列表 */}
            <MusicPlaylist active={player.song.value} playlist={playlist} onClick={payload => songsToggle(playlist.indexOf(payload))} />
          </div>
        </div>
      </div>
    </section>
  )
}
