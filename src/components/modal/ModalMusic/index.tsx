'use client'

import { LyricGetResponseType } from '@/app/api/music/neteasecloud/lyric/route'
import { MusicPlayListGetResponseType } from '@/app/api/music/neteasecloud/playlist/route'
import ModalCore, { ModalCorePropsType } from '@/components/modal/ModalCore'
import Loop from '@/components/svg-icon/Loop'
import Random from '@/components/svg-icon/Random'
import { cn } from '@/lib/cn'
import { CustomFetch } from '@/lib/server/fetch'
import { KeyboardDoubleArrowRight, Pause, PlayArrow, Refresh, SkipNext, SkipPrevious } from '@mui/icons-material'
import { IconButton, ModalClose } from '@mui/joy'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { ImmerReducer, useImmerReducer } from 'use-immer'
import Lyric, { LyricRefType } from './Lyric'
import Playlist, { PlaylistRefType } from './Playlist'
import ProgressBar, { ProgressBarRefType } from './ProgressBar'

const getSongUrl = async (id: number) => {
  return await CustomFetch<{ url: string }>(`/api/music/neteasecloud/song?id=${id}`)
}

export interface PlayerType {
  index: number
  list: MusicPlayListGetResponseType
  lyric: {
    has: Record<keyof LyricGetResponseType, boolean>
    use: keyof LyricGetResponseType | null
  }
  mode: 'loop' | 'order' | 'random'
  playing: boolean
  randomList: PlayerType['list']
  url: string | null
}
type PlayerActionType =
  | { payload: PlayerType['list']; type: 'setList' }
  | { payload: PlayerType['lyric']['has']; type: 'setLyricHas' }
  | { type: 'setLyricUseNext' }
  | { payload: PlayerType['mode']; type: 'setMode' }
  | { payload: boolean; type: 'setStatus' }
  | { payload: string; type: 'setUrl' }
  | { payload: number; type: 'toggle' }
  | { payload: number; type: 'playIndex' }

const reducer: ImmerReducer<PlayerType, PlayerActionType> = (state, action) => {
  switch (action.type) {
    case 'setList':
      state.list = action.payload
      state.randomList = Array.from(action.payload).sort(() => Math.random() - 0.5)
      break
    case 'setLyricHas':
      state.lyric.has = action.payload
      break
    case 'setLyricUseNext':
      const uses = Array.from<PlayerType['lyric']['use']>(['lrc', 'tlyric', 'romalrc', 'klyric'])
        .filter(key => key && state.lyric.has[key])
        .concat(null)
      if (uses.length <= 1) return
      const useIndex = uses.findIndex(use => use == state.lyric.use)
      state.lyric.use = uses.concat(uses)[useIndex + 1]
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

export interface MusicPropsType extends Pick<ModalCorePropsType, 'component'> {
  value: MusicPlayListGetResponseType
}

export default function Music({ value: playlist, component: Component }: MusicPropsType) {
  const [player, dispatch] = useImmerReducer(reducer, {
    index: 0,
    list: [],
    lyric: {
      has: { klyric: false, lrc: false, romalrc: false, tlyric: false },
      use: null
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
  const [isFirstOpen, setIsFirstOpen] = React.useState(false)
  const toggleCount = React.useRef(0)
  React.useEffect(() => {
    if (!isFirstOpen) return
    if (player.list.length == 0) return
    progressBarRef.current?.setProgress(0)
    void (async () => {
      try {
        const { url } = await getSongUrl(player.list[player.index].id)
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
  }, [dispatch, isFirstOpen, player.index, player.list])

  // 歌曲加载中
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    setLoading(true)
  }, [player.url])

  // 播放器
  const audioRef = React.useRef<HTMLAudioElement>(null)
  // 播放列表
  const playlistRef = React.useRef<PlaylistRefType>(null)
  // 进度条
  const progressBarRef = React.useRef<ProgressBarRefType>(null)
  // 歌词
  const lyricRef = React.useRef<LyricRefType>(null)

  if (player.list.length == 0) return null

  return (
    <ModalCore
      disableBackdropClickClose
      keepMounted
      className="overflow-hidden rounded-xl p-0"
      component={Component}
      onClose={() => playlistRef.current?.setOpen(false)}
      onOpen={() => setIsFirstOpen(true)}
    >
      <ModalClose className="rounded-full bg-transparent" />
      {/* 播放器 */}
      {player.url && (
        <audio
          key={player.url}
          ref={audioRef}
          loop={player.mode == 'loop'}
          src={player.url}
          onCanPlay={() => {
            setLoading(false)
            if (player.playing) {
              audioRef.current?.play()
            }
          }}
          onEnded={() => dispatch({ payload: 1, type: 'toggle' })}
          onError={() => {
            toast(`《${player.list[player.index].name}》加载失败`)
            setTimeout(dispatch, 2000, { type: 'next' })
          }}
          onTimeUpdate={event => {
            const second = (event.target as HTMLAudioElement).currentTime
            progressBarRef.current?.setProgress(second * 1000)
            lyricRef.current?.setProgress(second)
          }}
        />
      )}
      <section className="flex h-[600px] max-h-[calc(100dvh-theme(height.header))] w-[calc(100vw-40px)] max-w-lg flex-col overflow-hidden rounded-lg bg-white dark:bg-stone-900">
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
            <Lyric
              ref={lyricRef}
              className="absolute inset-x-0 bottom-0"
              id={player.list[player.index].id}
              type={player.lyric.use}
              onLoad={value => dispatch({ payload: value, type: 'setLyricHas' })}
            />
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
              {player.lyric.has.lrc && (
                <IconButton
                  className={cn('rounded-full', {
                    'line-through decoration-2': player.lyric.use == null
                  })}
                  color="neutral"
                  variant="plain"
                  onClick={() => dispatch({ type: 'setLyricUseNext' })}
                >
                  {player.lyric.use == null && '词'}
                  {player.lyric.use == 'lrc' && '词'}
                  {player.lyric.use == 'tlyric' && '译'}
                  {player.lyric.use == 'romalrc' && '音'}
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
                <IconButton className="rounded-full" color="neutral" variant="plain" onClick={() => dispatch({ payload: 'random', type: 'setMode' })}>
                  <KeyboardDoubleArrowRight />
                </IconButton>
              )}
              {/* 随机播放 */}
              {player.mode == 'random' && (
                <IconButton className="rounded-full" color="neutral" variant="plain" onClick={() => dispatch({ payload: 'loop', type: 'setMode' })}>
                  <Random />
                </IconButton>
              )}
              {/* 循环播放 */}
              {player.mode == 'loop' && (
                <IconButton className="rounded-full" color="neutral" variant="plain" onClick={() => dispatch({ payload: 'order', type: 'setMode' })}>
                  <Loop />
                </IconButton>
              )}
              {/* 播放列表 */}
              <Playlist ref={playlistRef} activeIndex={player.index} value={player.list} onClick={value => dispatch({ payload: value, type: 'playIndex' })} />
            </div>
          </div>
        </div>
      </section>
    </ModalCore>
  )
}
