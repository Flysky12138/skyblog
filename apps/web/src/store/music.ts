import { clamp, pick, range, shuffle } from 'es-toolkit'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { SongDetailResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/songs/model'

interface MusicStore {
  playMode: PlayMode
  volume: number

  /**
   * 当前歌曲在 `playOrder` 中的位置
   */
  currentIndex: number
  playlist: Song[]
  /**
   * 当前播放顺序，元素是 `playlist` 的 index。动态维护内容，实现随机播放
   */
  playOrder: number[]

  setVolume: (volume: number) => void

  setPlaylist: (playlist: Song[]) => void
  setPlayMode: (mode: PlayMode) => void

  next: () => void
  prev: () => void
  setCurrentIndex: (index: number) => void
  setCurrentSong: (id: number) => void
}

type PlayMode = 'random' | 'sequence' | 'single'
type Song = SongDetailResponseType

function middleware(fn: StateCreator<MusicStore>) {
  return persist(fn, {
    name: 'music',
    version: 1,
    partialize: state => pick(state, ['playMode', 'volume'])
  })
}

export const useMusicStore = create<MusicStore>()(
  middleware((set, get) => ({
    playing: false,
    playMode: 'sequence',
    volume: 1,

    currentIndex: 0,
    playlist: [],
    playOrder: [],

    setVolume: volume => set({ volume: clamp(volume, 0, 1) }),

    setPlaylist: playlist => {
      const { playMode } = get()

      const indexOrder = range(playlist.length)

      set({
        currentIndex: 0,
        playlist,
        playOrder: playMode === 'random' ? shuffle(indexOrder) : indexOrder
      })
    },
    setPlayMode: playMode => {
      const { currentIndex, playOrder } = get()
      const count = playOrder.length

      if (count === 0) {
        set({ currentIndex: 0, playMode, playOrder: [] })
        return
      }

      const currentSongIndex = playOrder[currentIndex]

      if (playMode === 'random') {
        const remaining = range(count).filter(index => index !== currentSongIndex)
        set({
          currentIndex: 0,
          playMode,
          playOrder: [currentSongIndex, ...shuffle(remaining)]
        })
        return
      }

      if (playMode === 'sequence') {
        const playOrder = range(count)
        set({
          currentIndex: Math.max(0, playOrder.indexOf(currentSongIndex)),
          playMode,
          playOrder
        })
        return
      }

      set({ playMode })
    },

    next: () => {
      const { currentIndex, playMode, playOrder } = get()
      const count = playOrder.length

      if (count === 0) return

      // 单曲循环不影响手动下一首
      if (currentIndex < count - 1) {
        set({ currentIndex: currentIndex + 1 })
        return
      }

      // 播放到队列末尾，再次打乱歌曲顺序
      if (playMode === 'random') {
        const currentSongIndex = playOrder[currentIndex]
        const remaining = range(count).filter(index => index !== currentSongIndex)
        set({
          currentIndex: 0,
          playOrder: [currentSongIndex, ...shuffle(remaining)]
        })
        return
      }

      set({ currentIndex: 0 })
    },
    prev: () => {
      const { currentIndex, playOrder } = get()
      const count = playOrder.length

      if (count === 0) return

      set({ currentIndex: currentIndex > 0 ? currentIndex - 1 : count - 1 })
    },
    setCurrentIndex: index => {
      const { playOrder } = get()
      const count = playOrder.length

      set({ currentIndex: count > 0 ? clamp(index, 0, count - 1) : 0 })
    },
    setCurrentSong: id => {
      const { playlist, playOrder } = get()

      const playlistIndex = playlist.findIndex(song => song.id === id)
      if (playlistIndex === -1) return

      const currentIndex = playOrder.indexOf(playlistIndex)
      if (currentIndex === -1) return

      set({ currentIndex })
    }
  }))
)
