import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

/**
 * 毫秒转模板
 * @default format = 'mm:ss'
 */
export const millisecondToTemplate = (time: number, format = 'mm:ss') => {
  return dayjs.duration(time, 'millisecond').format(format)
}

/**
 * 时间模板转秒
 * @default format = 'mm:ss.SSS'
 */
export const templateTimeToSeconds = (time: string, format = 'mm:ss.SSS') => {
  const now = dayjs('00:00.000', 'mm:ss.SSS')
  const t = dayjs(time, format)
  return (t.valueOf() - now.valueOf()) / 1000
}

/**
 * 距此时的相对时间
 */
export const fromNow = (time: Date) => {
  return dayjs(time).fromNow()
}

/**
 * 后端给的 ISO 时间转指定字符串
 */
export const formatISOTime = (time: Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 后端给的 ISO 时间转指定字符串
 */
export const formatISOTime2 = (time: Date) => {
  return dayjs(time).format('YYYY年MM月DD日，星期dd，HH:mm')
}
