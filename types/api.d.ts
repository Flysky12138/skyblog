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

/** `CustomRequest` 请求配置 */
type CustomRequestOptions<T extends keyof ApiMap> = Omit<ApiMap[T], 'return'> & RemoveEmptyObjectKeys<{ params: RouteParams<T> }>

/** 接口返回的错误类型 */
interface ResponseError {
  message: string
}
