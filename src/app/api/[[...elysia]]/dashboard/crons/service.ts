import dayjs from 'dayjs'
import { limitAsync } from 'es-toolkit'

import { WeCom } from '@/lib/http/wecom'
import { prisma } from '@/lib/prisma'

import { CronCreateBodyType, CronUpdateBodyType } from './model'

export abstract class Service {
  /**
   * 创建 Cron
   */
  static async create(data: CronCreateBodyType) {
    return prisma.cron.create({ data })
  }

  /**
   * 删除 Cron
   */
  static async delete(id: string) {
    return prisma.cron.delete({
      where: { id }
    })
  }

  /**
   * 获取 Cron 详情
   */
  static async detail(id: string) {
    return prisma.cron.findUnique({
      where: { id }
    })
  }

  /**
   * 获取 Cron 列表
   */
  static async list() {
    return prisma.cron.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * 运行单个 Cron
   */
  static async run(id: string) {
    const { content, isEnabled, name } = await prisma.cron.findUniqueOrThrow({
      where: { id }
    })

    if (!isEnabled) throw new Error('Cron is disabled')

    try {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      const fn = new AsyncFunction('WeCom', 'now', content.replace(/^\s*export\s+{\s*?}/m, ''))
      await fn(WeCom, now)
    } catch (error) {
      const message = (error as Error).message
      await WeCom.markdown_v2([`# ${name} - Error`, now(), '```json', message, '```'].join('\n'))
      throw new Error(message)
    }
  }

  /**
   * 运行所有 Cron
   * @default concurrency = 10
   */
  static async runAll(concurrency = 10) {
    const crons = await prisma.cron.findMany()
    const limit = limitAsync(this.run, concurrency)
    return Promise.allSettled(
      Array.from(
        crons.filter(cron => cron.isEnabled),
        cron => limit(cron.id)
      )
    )
  }

  /**
   * 更新 Cron
   */
  static async update(id: string, data: CronUpdateBodyType) {
    return prisma.cron.update({
      data,
      where: { id }
    })
  }
}

const now = () => {
  return dayjs().tz('Asia/Shanghai').format('YYYY年MM月DD日，星期dd，HH:mm:ss')
}
