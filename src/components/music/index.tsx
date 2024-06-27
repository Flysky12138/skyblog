'use client'

import { GET } from '@/app/api/music/neteasecloud/lyric/route'
import { GET as GET2 } from '@/app/api/music/neteasecloud/playlist/route'
import Loop from '@/components/svg-icon/Loop'
import Random from '@/components/svg-icon/Random'
import { cn } from '@/lib/cn'
import { CustomRequest } from '@/lib/server/request'
import { KeyboardDoubleArrowRight, Pause, PlayArrow, Refresh, SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { useAsync } from 'react-use'
import { toast } from 'sonner'
import { ImmerReducer, useImmerReducer } from 'use-immer'
import Lyric, { LyricRef } from './Lyric'
import Playlist from './Playlist'
import ProgressBar, { ProgressBarRef } from './ProgressBar'

export interface Player {
  index: number
  list: MusicProps['value']
  lyrics: {
    use: keyof GET['return'] | null
    value: GET['return']
  }
  mode: 'loop' | 'order' | 'random'
  playing: boolean
  randomList: Player['list']
  url: string | null
}

type PlayerActionType =
  | { payload: Player['list']; type: 'setList' }
  | { payload: Player['lyrics']['value']; type: 'setLyrics' }
  | { type: 'setLyricUseNext' }
  | { payload: Player['mode']; type: 'setMode' }
  | { payload: boolean; type: 'setStatus' }
  | { payload: string; type: 'setUrl' }
  | { payload: number; type: 'toggle' }
  | { payload: number; type: 'playIndex' }

const reducer: ImmerReducer<Player, PlayerActionType> = (state, action) => {
  switch (action.type) {
    case 'setList':
      state.list = action.payload
      state.randomList = Array.from(action.payload).sort(() => Math.random() - 0.5)
      break
    case 'setLyrics':
      state.lyrics.value = action.payload
      break
    case 'setLyricUseNext':
      const uses = Array.from<Player['lyrics']['use']>(['lrc', 'tlyric', 'romalrc', 'klyric'])
        .filter(key => key && state.lyrics.value[key])
        .concat(null)
      if (uses.length <= 1) return
      const useIndex = uses.findIndex(use => use == state.lyrics.use)
      state.lyrics.use = uses.concat(uses)[useIndex + 1]
      break
    case 'setMode':
      state.mode = action.payload
      break
    case 'setStatus':
      state.playing = action.payload
      break
    case 'setUrl':
      state.url = action.payload
      break
    case 'toggle':
      state.url = null
      let playIndex = state.mode == 'random' ? state.randomList.findIndex(({ id }) => id == state.list[state.index].id) : state.index
      playIndex = (state.list.length + playIndex + action.payload) % state.list.length
      state.index = state.mode == 'random' ? state.list.findIndex(({ id }) => id == state.randomList[playIndex].id) : playIndex
      break
    case 'playIndex':
      state.url = null
      state.index = action.payload
      break
  }
}

export interface MusicProps {
  className?: string
  value: Array<GET2['return'][number] & { lyrics?: Player['lyrics']['value']; url?: string }>
}

export default function Music({ value: playlist, className }: MusicProps) {
  const [player, dispatch] = useImmerReducer(reducer, {
    index: 0,
    list: [],
    lyrics: {
      use: null,
      value: { klyric: null, lrc: null, romalrc: null, tlyric: null }
    },
    mode: 'order',
    playing: false,
    randomList: [],
    url: null
  })

  // 设置播放列表
  React.useEffect(() => {
    dispatch({ payload: playlist, type: 'setList' })
  }, [dispatch, playlist])

  // 获取歌曲链接
  const toggleCount = React.useRef(0)
  React.useEffect(() => {
    if (player.list.length == 0) return
    progressBarRef.current?.setProgress(0)
    void (async () => {
      try {
        let { url } = player.list[player.index]
        if (!url) {
          const data = await CustomRequest('GET api/music/neteasecloud/song', { search: { id: player.list[player.index].id } })
          url = data.url
        }
        if (!url) throw `《${player.list[player.index].name}》地址获取失败`
        dispatch({ payload: url, type: 'setUrl' })
        toggleCount.current = 0
      } catch (error) {
        toast.warning(error as string)
        // 最多连续切换 10 次
        if (toggleCount.current++ < 10) {
          setTimeout(() => {
            dispatch({ payload: 1, type: 'toggle' })
          }, 2000)
        }
      }
    })()
  }, [dispatch, player.index, player.list])

  // 获取歌词
  useAsync(async () => {
    let { lyrics } = player.list[player.index]
    if (!lyrics) lyrics = await CustomRequest('GET api/music/neteasecloud/lyric', { search: { id: player.list[player.index].id } })
    dispatch({ payload: lyrics, type: 'setLyrics' })
  }, [player.index, player.list])

  // 当前歌词
  const currentLyric = React.useMemo(() => {
    if (!player.lyrics.use) return null
    return player.lyrics.value[player.lyrics.use] ?? player.lyrics.value['lrc']
  }, [player.lyrics.use, player.lyrics.value])

  // 歌曲加载中
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    setLoading(true)
  }, [player.url])

  // 播放器
  const audioRef = React.useRef<HTMLAudioElement>(null)
  // 进度条
  const progressBarRef = React.useRef<ProgressBarRef>(null)
  // 歌词
  const lyricRef = React.useRef<LyricRef>(null)

  if (player.list.length == 0) return null

  return (
    <section
      className={cn(
        'flex h-[600px] max-h-[calc(100dvh-theme(height.header))] w-[calc(100vw-40px)] max-w-lg flex-col overflow-hidden rounded-lg bg-white dark:bg-stone-900',
        className
      )}
    >
      {/* 播放器 */}
      {player.url && (
        <audio
          key={player.url}
          ref={audioRef}
          loop={player.mode == 'loop' || player.list.length <= 1}
          src={player.url}
          onCanPlay={() => {
            setLoading(false)
            if (player.playing) {
              audioRef.current?.play()
            }
          }}
          onEnded={() => dispatch({ payload: 1, type: 'toggle' })}
          onError={() => {
            toast.error(`《${player.list[player.index].name}》加载失败`)
            setTimeout(dispatch, 2000, { type: 'next' })
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
          key={player.index}
          animate={{ opacity: 1 }}
          className="relative grow select-none dark:brightness-75"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {/* 封面 */}
          <Image fill unoptimized alt={player.list[player.index].name} className="object-cover" src={player.list[player.index].picUrl} />
          {/* 歌词 */}
          <Lyric ref={lyricRef} className="absolute inset-x-0 bottom-0" value={currentLyric} />
        </motion.div>
      </AnimatePresence>
      <div className="px-5 py-4">
        {/* 歌名 */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={player.index}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-x-2 whitespace-nowrap"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: -20 }}
          >
            <p className="shrink-0 overflow-hidden font-title text-xl">{player.list[player.index].name}</p>
            <p className="truncate text-sm opacity-60">{player.list[player.index].ar.join('/')}</p>
          </motion.div>
        </AnimatePresence>
        {/* 进度条 */}
        <ProgressBar
          ref={progressBarRef}
          maxValue={player.list[player.index].dt}
          onChange={value => {
            if (audioRef.current) {
              audioRef.current.currentTime = value / 1000
            }
          }}
        />
        {/* 控制器 */}
        <div className="mt-3 grid grid-cols-3 items-center">
          <div className="jspace-x-2 ustify-self-start">
            {/* 歌词切换 */}
            {player.lyrics.value.lrc && (
              <IconButton
                className={cn('rounded-full', {
                  'line-through decoration-2': player.lyrics.use == null
                })}
                color="neutral"
                variant="plain"
                onClick={() => dispatch({ type: 'setLyricUseNext' })}
              >
                {player.lyrics.use == null && '词'}
                {player.lyrics.use == 'lrc' && '词'}
                {player.lyrics.use == 'tlyric' && '译'}
                {player.lyrics.use == 'romalrc' && '音'}
              </IconButton>
            )}
          </div>
          <div className="flex items-center gap-x-3 justify-self-center sm:gap-x-5">
            {/* 上一首 */}
            <IconButton className="rounded-full" disabled={player.list.length <= 1} onClick={() => dispatch({ payload: -1, type: 'toggle' })}>
              <SkipPrevious />
            </IconButton>
            {/* 播放、暂停 */}
            <IconButton
              className="rounded-full"
              disabled={loading && !player.playing}
              size="md"
              variant="solid"
              onClick={() => {
                dispatch({ payload: !player.playing, type: 'setStatus' })
                audioRef.current?.[player.playing ? 'pause' : 'play']()
              }}
            >
              {loading ? <Refresh className="animate-spin" /> : player.playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            {/* 下一首 */}
            <IconButton className="rounded-full" disabled={player.list.length <= 1} onClick={() => dispatch({ payload: 1, type: 'toggle' })}>
              <SkipNext />
            </IconButton>
          </div>
          <div className="space-x-2 justify-self-end">
            {/* 顺序播放 */}
            {player.mode == 'order' && (
              <IconButton
                className="rounded-full"
                color="neutral"
                disabled={player.list.length <= 1}
                variant="plain"
                onClick={() => dispatch({ payload: 'random', type: 'setMode' })}
              >
                <KeyboardDoubleArrowRight />
              </IconButton>
            )}
            {/* 随机播放 */}
            {player.mode == 'random' && (
              <IconButton
                className="rounded-full"
                color="neutral"
                disabled={player.list.length <= 1}
                variant="plain"
                onClick={() => dispatch({ payload: 'loop', type: 'setMode' })}
              >
                <Random />
              </IconButton>
            )}
            {/* 循环播放 */}
            {player.mode == 'loop' && (
              <IconButton
                className="rounded-full"
                color="neutral"
                disabled={player.list.length <= 1}
                variant="plain"
                onClick={() => dispatch({ payload: 'order', type: 'setMode' })}
              >
                <Loop />
              </IconButton>
            )}
            {/* 播放列表 */}
            <Playlist activeIndex={player.index} value={player.list} onClick={value => dispatch({ payload: value, type: 'playIndex' })} />
          </div>
        </div>
      </div>
    </section>
  )
}
