/**
 * 对对象的某些键值进行处理
 */
export const convertKeyValues = <
  T extends Record<string, any>,
  D extends {
    [K in keyof T]?: (value: T[K]) => unknown
  }
>(
  target: T,
  convert: D
) => {
  for (const key of Object.keys(convert)) {
    Reflect.set(target, key, convert[key]!(target[key]))
  }
  return target as Omit<T, keyof D> & Record<keyof D, ReturnType<NonNullable<D[keyof D]>>>
}
