/** 深度美化对象的显示 */
type DeepPrettify<T> = { [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K] }

/** 以 `T` 结尾的字符串 */
type EndsWith<T extends string> = `${string}${T}`

/** 选择对象以 `D` 开头的键 */
type PickStartsWith<T, D extends string> = {
  [K in keyof T as K extends StartsWith<D> ? K : never]: T[K]
}

/** 将选中的键设置为可选 */
type PratialPick<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 美化对象的显示 */
type Prettify<T> = NonNullable<{ [K in keyof T]: T[K] }>

/** 移除值为空对象的键 */
type RemoveKeysByEmptyValue<T extends Record<string, object>> = {
  [K in keyof T as keyof T[K] extends never ? never : K]: T[K]
}

/** 将选中的键设置为必选 */
type RequiredPick<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/** 以 `T` 开头的字符串 */
type StartsWith<T extends string> = `${T}${string}`

/** 取对象值 */
type ValueOf<T> = Required<T>[keyof T]

type Without<T, U> = Partial<Record<Exclude<keyof T, keyof U>, never>>

/** 对象进行异或 */
type XOR<T, U> = T | U extends object ? (T & Without<U, T>) | (U & Without<T, U>) : T | U
