import { timeToSeconds } from './time'

/**
 * 处理网易云音乐的歌词
 */
export const parseLyric = (lyric?: string) => {
  if (!lyric) return null

  const matcher = lyric.matchAll(/\[([\d:.]+)\]\r*(.*)$/gm)
  let lyrics = Array.from(matcher, ([_, second, lrc]) => ({
    lyric: lrc.trim(),
    time: timeToSeconds(second, 'mm:ss.'.padEnd(second.length, 'S'))
  }))

  // 过滤存在错误数据的歌词
  lyrics = lyrics.filter((lyric, index) => {
    if (index == 0) return true
    const preLyric = lyrics[index - 1]
    if (lyric.lyric == preLyric.lyric) return false // 前后歌词一样
    if (lyric.time < preLyric.time) return false // 时间不是单调非递减
    return true
  })

  if (lyrics.length == 0) return null

  return lyrics
}
