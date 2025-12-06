/** `fetch` 请求配置 */
interface FetchOptions extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  body?: any
  headers?: Record<string, string>
  method?: Method
}

/** 请求方法 */
type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'

/** 协议 */
type Protocol = 'http:' | 'https:'

/** 接口返回的错误类型 */
interface ResponseError {
  message: string
}

/** 文件路由请求参数、内容以及响应的类型 */
type RouteHandlerType<
  T extends {
    body?: unknown
    return?: unknown
    search?: unknown
  }
> = T
