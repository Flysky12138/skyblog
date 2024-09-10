/** `postMessage` 发送的数据 */
interface MessageEventDataType<T extends string, D extends object = {}> {
  type: T
  value?: D
}
