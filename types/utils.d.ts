/** 以 `T` 开头的字符串 */
type StartsWith<T extends string> = `${T}${string}`
/** 选择对象以 `T` 开头的键 */
type PickStartsWith<T, D extends string> = {
  [K in keyof T as K extends StartsWith<D> ? K : never]: T[K]
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
/** 对象进行异或 */
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

/** 移除对象值的可选 */
type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}

/** 移除值为空对象的键 */
type RemoveEmptyObjectKeys<T extends { [k in string]: object }> = {
  [K in keyof T as keyof T[K] extends never ? never : K]: T[K]
}

/** 解包 `Promise` */
type UnwrapPromise<T> = T extends Promise<infer D> ? D : T
