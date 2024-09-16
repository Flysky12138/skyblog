import { convertKeyValues } from '@/lib/parser/object'
import { Prisma } from '@prisma/client'

/**
 * 获取时，由于开发、生产环境数据库 `variables` 使用类型不同，故统一将值转换为对象
 */
export const convertClashGetData = <T extends Record<Prisma.ClashScalarFieldEnum, unknown>>(target: T) => {
  return convertKeyValues(target, {
    variables: value => (typeof value == 'string' ? JSON.parse(value) : value) as object
  })
}

/**
 * 存储时，由于开发、生产环境数据库 `variables` 使用类型不同，故统一将值转换为对应类型
 */
export const convertClashSaveData = <T extends Partial<Record<Prisma.ClashScalarFieldEnum, unknown>>>(target: T) => {
  return convertKeyValues(target, {
    variables: value => (process.env.NODE_ENV == 'development' ? JSON.stringify(value) : value) as any
  })
}
