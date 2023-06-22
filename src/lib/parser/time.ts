import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.locale('zh-cn')
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

/**
 * 毫秒转指定时间模板
 * @default
 * format = 'mm:ss'
 * @example
 * formatMillisecond(114514) // 01:54
 */
export const formatMillisecond = (ms: number, format = 'mm:ss') => {
  return dayjs.duration(ms, 'millisecond').format(format)
}

/**
 * 时间转秒
 * @param time 时间
 * @param format `time` 对应的模板格式
 * @default
 * format = 'mm:ss.SSS'
 * @example
 * timeToSeconds('11:11.000') // 671.001
 */
export const timeToSeconds = (time: string, format = 'mm:ss.SSS') => {
  const now = dayjs('00:00.000', 'mm:ss.SSS')
  const t = dayjs(time, format)
  return (t.valueOf() - now.valueOf()) / 1000
}

/**
 * 距此时的相对时间
 * @example
 * fromNow(new Date()) // 几秒前
 */
export const fromNow = (time: Date) => {
  return dayjs(time).fromNow()
}

/**
 * 后端给的 ISO 时间转指定字符串
 * @example
 * formatISOTime(new Date()) // 2024-05-29 08:19:52
 */
export const formatISOTime = (time: Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 后端给的 ISO 时间转指定字符串
 * @example
 * formatISOTime2(new Date()) // 2024年05月29日，星期三，08:21
 */
export const formatISOTime2 = (time: Date) => {
  return dayjs(time).format('YYYY年MM月DD日，星期dd，HH:mm')
}
