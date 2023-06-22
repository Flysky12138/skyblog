/** 以 `T` 开头的字符串 */
type StartsWith<T extends string> = `${T}${string}`
/** 以 `T` 结尾的字符串 */
type EndsWith<T extends string> = `${string}${T}`

/** 选择对象以 `T` 开头的键 */
type PickStartsWith<T, D extends string> = {
  [K in keyof T as K extends StartsWith<D> ? K : never]: T[K]
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
/** 对象进行异或 */
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

/** 移除值为空对象的键 */
type RemoveKeysByEmptyValue<T extends { [k in string]: object }> = {
  [K in keyof T as keyof T[K] extends never ? never : K]: T[K]
}

/** 将选中的键设置为可选 */
type PratialPick<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
/** 将选中的键设置为必选 */
type RequiredPick<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
