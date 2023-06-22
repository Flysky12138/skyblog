type StringStartWith<T extends string> = `${T}${string}`
type PickKeyStartWith<T, D extends string> = {
  [K in keyof T as K extends StringStartWith<D> ? K : never]: T[K]
}
type NonNullableObject<T extends object> = {
  [K in keyof T]: NonNullable<T[K]>
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type MakeRequired<T> = {
  [K in keyof T]-?: T[K]
}

/**
 * `error.tsx` or `global-error.tsx` 错误边界捕获类型
 */
interface ErrorBoundary {
  error: Error
  reset: () => void
}

/**
 * 动态路由类型。`T` 动态段类型，`D` 搜索参数类型
 */
interface DynamicRoute<T extends Record<string, string | string[]>, D extends Record<string, string | string[] | undefined> = {}> {
  params: T
  searchParams: Partial<D>
}

/**
 * 接口错误的返回类型
 */
interface ErrorResponse {
  message: string
}
