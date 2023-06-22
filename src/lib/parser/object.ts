/**
 * 对对象的某些键值进行处理，修改源对象
 */
export const convertObjectValues = <
  T extends Record<string, any>,
  D extends {
    [K in keyof T]?: (value: T[K]) => unknown
  }
>(
  target: T,
  convert: D
) => {
  for (const key of Object.keys(convert)) {
    if (Reflect.has(target, key)) {
      Reflect.set(target, key, convert[key]?.(target[key]))
    }
  }
  return target as Omit<T, keyof D> & {
    [K in keyof D]: D[K] extends (value: any) => infer R ? R : never
  }
}
