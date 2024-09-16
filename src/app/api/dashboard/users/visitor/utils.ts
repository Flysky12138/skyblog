import { convertKeyValues } from '@/lib/parser/object'
import { Prisma } from '@prisma/client'
import { Geo } from '@vercel/functions'
import { userAgent } from 'next/server'

/**
 * 获取时，由于开发、生产环境数据库 `agent`、`geo` 使用类型不同，故统一将值转换为对象
 */
export const convertVisitorLogGetData = <T extends Record<Prisma.VisitorLogScalarFieldEnum, unknown>>(target: T) => {
  return convertKeyValues(target, {
    agent: value => (typeof value == 'string' ? JSON.parse(value) : value) as ReturnType<typeof userAgent>,
    geo: value => (typeof value == 'string' ? JSON.parse(value) : value) as Geo
  })
}

/**
 * 存储时，由于开发、生产环境数据库 `agent`、`geo` 使用类型不同，故统一将值转换为对应类型
 */
export const convertVisitorLogSaveData = <T extends Partial<Record<Prisma.VisitorLogScalarFieldEnum, unknown>>>(target: T) => {
  return convertKeyValues(target, {
    agent: value => (process.env.NODE_ENV == 'development' ? JSON.stringify(value) : value) as any,
    geo: value => (process.env.NODE_ENV == 'development' ? JSON.stringify(value) : value) as any
  })
}
