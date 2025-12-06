/** 请求方法 */
type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'

/** 协议 */
type Protocol = 'http:' | 'https:'

/** 文件路由请求参数、内容以及响应的类型 */
type RouteHandlerType<
  T extends {
    body?: unknown
    return?: unknown
    search?: unknown
  }
> = T
