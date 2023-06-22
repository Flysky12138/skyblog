/** `fetch` 请求配置 */
interface FetchOptions extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  body?: any
  headers?: Record<string, string>
  method?: Method
}

/** 请求方法 */
type Method = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT'

/** 协议 */
type Protocol = 'http:' | 'https:'

/** 接口返回的错误类型 */
interface ResponseError {
  message: string
}
