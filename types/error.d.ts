/** `error.tsx` or `global-error.tsx` 错误边界捕获类型 */
interface ErrorBoundary {
  error: Error
  reset: () => void
}

/** 接口错误的返回类型 */
interface ErrorResponse {
  message: string
}
