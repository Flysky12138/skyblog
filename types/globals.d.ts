/** 文件目录 */
type FilePathType = '/' | `/${string}/`

/** `postMessage` 发送的数据 */
interface MessageEventData<T extends string, D extends object = {}> {
  type: T
  value?: D
}
