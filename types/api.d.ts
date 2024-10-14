/** 请求方法 */
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

/** 协议 */
type Protocol = 'http:' | 'https:'

/** `fetch` 请求配置 */
interface FetchOptions extends Omit<RequestInit, 'method' | 'headers' | 'body'> {
  body?: any
  headers?: Record<string, string>
  method?: Method
}

/** 文件路由请求参数、内容以及响应的类型 */
type MethodRouteType<
  T extends {
    body?: unknown
    return?: unknown
    search?: unknown
  }
> = T

/** `CustomRequest` 请求配置 */
type CustomRequestOptions<T extends keyof ApiMap> = Omit<ApiMap[T], 'return'> & RemoveEmptyObjectKeys<{ params: ParamsByApi<T> }>
