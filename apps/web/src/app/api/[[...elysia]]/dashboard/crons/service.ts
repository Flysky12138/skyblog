import dayjs from 'dayjs'
import { status } from 'elysia'
import { limitAsync } from 'es-toolkit'
import { transform } from 'sucrase'

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

    if (!isEnabled) {
      return status(400, { message: 'Cron is disabled' })
    }

    try {
      type AsyncFn = (payload: { now: typeof now; WeCom: WeCom }) => Promise<unknown>

      const { code } = transform(content, { transforms: ['typescript'] })

      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const createFn = new Function(code) as () => AsyncFn
      const runtimeFn = createFn()

      return await runtimeFn({ now, WeCom })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      await WeCom.markdown_v2([`# ${name} - Error`, now(), '```json', message, '```'].join('\n'))

      return status(500, { message })
    }
  }

  /**
   * 运行所有 Cron
   *
   * @default concurrency = 10
   */
  static async runAll(concurrency = 10) {
    const crons = await prisma.cron.findMany({
      where: {
        isEnabled: true
      }
    })
    const limit = limitAsync(this.run.bind(Service), concurrency)

    return Promise.allSettled(Array.from(crons, cron => limit(cron.id)))
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

/**
 * 获取当前时间
 */
const now = () => {
  return dayjs().tz('Asia/Shanghai').format('YYYY年MM月DD日，星期dd，HH:mm:ss')
}
