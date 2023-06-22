/** 动态路由类型。`T` 动态段类型，`D` 搜索参数类型 */
type DynamicRoute<T extends Record<string, string | string[]>, D extends Record<string, string | string[] | undefined> = {}> = {
  params: T
  searchParams: Partial<D>
}

type Merge<O> = { [K in keyof O]: O[K] }
type NonEmpty = `${any}${any}`
type ExtractNext<T extends string, L extends string = ''> = T extends `${L}/${infer S extends NonEmpty}/${any}`
  ? [`${L}/${S}/`, S]
  : T extends `${L}${infer S extends NonEmpty}/${any}`
    ? [`${L}${S}/`, S]
    : T extends `${L}/${infer S extends NonEmpty}`
      ? [`${L}/${S}`, S]
      : T extends `${L}${infer S extends NonEmpty}`
        ? [`${L}${S}`, S]
        : []
/** 通过动态路由路径获取参数 */
type ParamsByApi<T extends string, L extends string = '', O = {}, Ambiguity extends string = ''> = Ambiguity extends '⛔⛔'
  ? never
  : ExtractNext<T, L> extends [infer L extends string, infer S extends NonEmpty]
    ? S extends `[${infer P extends NonEmpty}]`
      ? P extends `[...${infer G extends NonEmpty}]`
        ? ParamsByApi<T, L, Merge<O & { [K in G]?: string[] }>, `${Ambiguity}⛔`>
        : P extends `...${infer G extends NonEmpty}`
          ? ParamsByApi<T, L, Merge<O & { [K in G]: string[] }>, `${Ambiguity}⛔`>
          : ParamsByApi<T, L, Merge<O & { [K in P]: string }>, Ambiguity>
      : ParamsByApi<T, L, O, ''>
    : O
