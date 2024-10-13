/** 以 `T` 开头的字符串 */
type StartsWith<T extends string> = `${T}${string}`
/** 选择对象以 `T` 开头的键 */
type PickStartsWith<T, D extends string> = {
  [K in keyof T as K extends StartsWith<D> ? K : never]: T[K]
}

/** 将对象空值转 `never` */
type NonNullableObject<T extends object> = {
  [K in keyof T]: NonNullable<T[K]>
}

/** 对象进行异或 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

/** 移除对象值的可选 */
type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}

/** 空对象转 `never` */
type EmptyObject2Never<T extends object> = keyof T extends never ? never : T

/** 移除对象值为 `never` 的键 */
type RemoveNever<T extends object> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}
