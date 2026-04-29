import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

dayjs.locale('zh-cn')
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.extend(timezone)

export abstract class TimeHelper {
  /**
   * 后端给的 ISO 时间转指定字符串
   * @default template = 'YYYY-MM-DD HH:mm:ss'
   * @example
   * formatDate(new Date()) // 2024-05-29 08:19:52
   */
  static formatDate(time: Date, template = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(time).format(template)
  }

  /**
   * 毫秒转指定时间模板
   * @default format = 'mm:ss'
   * @example
   * formatMillisecond(114514) // 01:54
   */
  static formatMillisecond(ms: number, format = 'mm:ss') {
    return dayjs.duration(ms, 'millisecond').format(format)
  }

  /**
   * 距此时的相对时间
   * @example
   * fromNow(new Date()) // 几秒前
   */
  static fromNow(time: Date) {
    return dayjs(time).fromNow()
  }

  /**
   * 时间转秒
   * @default format = 'mm:ss.SSS'
   * @example
   * timeToSeconds('11:11.000') // 671.001
   */
  static timeToSeconds(time: string, format = 'mm:ss.SSS') {
    const now = dayjs('00:00.000', 'mm:ss.SSS')
    const t = dayjs(time, format)
    return (t.valueOf() - now.valueOf()) / 1000
  }
}
