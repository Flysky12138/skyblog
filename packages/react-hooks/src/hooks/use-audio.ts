import React from 'react'

export function useAudio(src?: string) {
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const [playing, setPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  // eslint-disable-next-line react/hook-use-state
  const [volume, setVolumeState] = React.useState(1)

  React.useEffect(() => {
    const audio = new Audio()

    audioRef.current = audio

    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.src = ''

      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)

      audioRef.current = null
    }
  }, [])

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()

    if (src) {
      audio.src = src
    } else {
      audio.removeAttribute('src')
    }

    audio.load()

    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [src])

  const play = React.useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    try {
      await audio.play()
      return true
    } catch {
      setPlaying(false)
      return false
    }
  }, [])

  const pause = React.useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = React.useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    if (audio.paused) {
      try {
        await audio.play()
        return true
      } catch {
        setPlaying(false)
        return false
      }
    }

    audio.pause()
    return true
  }, [])

  const seek = React.useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return

    audio.currentTime = Math.max(0, Math.min(time, audio.duration))
  }, [])

  const setVolume = React.useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio) return

    const nextVolume = Math.max(0, Math.min(value, 1))

    audio.volume = nextVolume
    setVolumeState(nextVolume)
  }, [])

  return {
    audioRef,

    currentTime,
    duration,
    playing,
    volume,

    pause,
    play,
    seek,
    setVolume,
    toggle
  }
}
