/** `postMessage` 发送的数据 */
interface MessageEventData<T extends string, D = unknown> {
  type: T
  value?: D
}

/** 请求方法 */
type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'

/** 协议 */
type Protocol = 'http:' | 'https:'
