import { convertKeyValues } from '@/lib/parser/object'
import { Clash } from '@prisma/client'
import { POST } from './route'

/**
 * 由于生产环境数据库 `variables` 使用类型不同，故统一将值转换为对象
 */
export const parseVariable = <T extends Pick<Clash, 'variables'> & Record<string, any>>(target: T) => {
  return convertKeyValues(target, {
    variables: value => (typeof value == 'string' ? (JSON.parse(value) as object) : value) as object
  })
}

/**
 * 由于生产环境数据库 `variables` 使用类型不同，故统一将值转换为对应类型（避免开发时的类型报错，将 `variables` 强制显示为 `string`）
 */
export const convertVariable = <T extends POST['body'] & Record<string, any>>(target: T) => {
  return convertKeyValues(target, {
    variables: value => (process.env.NODE_ENV == 'development' ? JSON.stringify(value) : value) as string
  })
}
