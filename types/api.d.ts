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

interface MethodRoute {
  body?: unknown
  return?: unknown
  search?: unknown
}
/** 请求参数以及响应的类型 */
type MethodRouteType<T extends MethodRoute> = T

/** `CustomRequest` 请求配置 */
type CustomRequestOptions<T extends keyof ApiMap> = Omit<ApiMap[T], 'return'> &
  RemoveNever<{
    params: EmptyObject2Never<ParamsByApi<T>>
  }>
