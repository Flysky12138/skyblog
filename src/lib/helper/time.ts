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

export abstract class TimeHelper {
  /**
   * 后端给的 ISO 时间转指定字符串
   * @example
   * formatISOTime(new Date()) // 2024-05-29 08:19:52
   */
  static formatISOTime(time: Date) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * 后端给的 ISO 时间转指定字符串
   * @example
   * formatISOTime2(new Date()) // 2024年05月29日，星期三，08:21
   */
  static formatISOTime2(time: Date) {
    return dayjs(time).format('YYYY年MM月DD日，星期dd，HH:mm')
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
