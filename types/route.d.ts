/** 动态路由类型。`T` 动态段类型，`D` 搜索参数类型 */
type DynamicRoute<T extends Record<string, string | string[]>, D extends Record<string, string | string[] | undefined> = {}> = {
  params: T
  searchParams: Partial<D>
}

/** 文件路由请求参数、内容以及响应的类型 */
type MethodRouteType<
  T extends {
    body?: unknown
    return?: unknown
    search?: unknown
  }
> = T

/** `error.tsx` or `global-error.tsx` 错误边界捕获类型 */
interface ErrorRouteProps {
  error: Error
  reset: () => void
}

type _IsArray<T> = T extends `${string}...${string}` ? true : false
type _Extract<T> = T extends `[...${infer F}]` | `...${infer F}` ? F : T
/**
 * 通过动态路由路径获取参数
 * @see https://github.com/type-challenges/type-challenges/issues/33614
 */
type RouteParams<T extends string, D extends Record<string, string | string[]> = {}> = T extends `${infer A}/[...]${infer B}`
  ? RouteParams<`${A}${B}`, D & { '...': string }>
  : T extends `${string}]/[...${string}`
    ? never
    : T extends `${infer A}[[${infer F}]]${infer B}`
      ? RouteParams<`${A}${B}`, D & (_Extract<F> extends '' ? {} : { [K in _Extract<F>]?: _IsArray<F> extends true ? string[] : string })>
      : T extends `${infer A}[${infer F}]${infer B}`
        ? RouteParams<`${A}${B}`, D & (_Extract<F> extends '' ? {} : { [K in _Extract<F>]: _IsArray<F> extends true ? string[] : string })>
        : { [K in keyof D]: D[K] }
