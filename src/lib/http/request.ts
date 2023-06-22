import { ParamMap } from '.next/dev/types/routes'

import { CustomFetch } from './fetch'

/**
 * 生成接口请求地址
 * @param path 接口文件的路径
 * @param params 动态参数
 */
const generatePath = (path: string, params: object) => {
  const kv = Array.from(Object.entries(params), ([k, v]) => [k, Array.isArray(v) ? v.join('/') : v])
  for (const [k, v] of kv) {
    const reg = new RegExp(`\\[{1,2}(\.{3})?${k}\\]{1,2}`)
    path = path.replace(reg, v)
  }
  // 移除剩余的可选参数
  path = path.replace(/\[{2}(\.{3})?\w+\]{2}/g, '')
  return path
}

/**
 * 用于请求基于 Nextjs 文件路由定义的接口
 */
export const CustomRequest = async <T extends keyof AppRouteHandlerMethodMap>(
  input: T,
  options: DeepPrettify<
    Omit<AppRouteHandlerMethodMap[T], 'return'> &
      RemoveKeysByEmptyValue<{
        params: T extends `${Method} ${infer R}` ? (R extends keyof ParamMap ? ParamMap[R] : never) : never
      }>
  >
) => {
  const [method, route] = input.split(' ') as [Method, string]
  const { body, params = {}, search = {} } = options || {}

  const url = new URL(generatePath(route, params), process.env.NEXT_PUBLIC_WEBSITE_URL)
  url.search = new URLSearchParams(search).toString()

  const res = await CustomFetch<Prettify<AppRouteHandlerMethodMap[T]['return']>>(url, {
    body,
    method
  })

  return res
}
