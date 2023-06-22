/** 请求方法 */
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

/** 协议 */
type Protocol = 'http:' | 'https:'

/** `fetch` 请求配置 */
interface FetchOption extends Omit<RequestInit, 'method' | 'headers' | 'body'> {
  body?: any
  headers?: Record<string, string>
  method?: Method
}

interface MethodRequest {
  search?: unknown
  body?: unknown
  return?: unknown
}
/** 请求参数以及响应的类型 */
type MethodRequestType<T extends MethodRequest> = T

/** `CustomRequest` 请求配置 */
type CustomRequestOption<T extends keyof ApiMap> = Omit<ApiMap[T], 'return'> &
  RemoveNever<{
    params: EmptyObject2Never<ParamsByApi<T>>
  }>
