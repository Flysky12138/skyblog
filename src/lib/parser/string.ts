/**
 * 解析文本所有 `#{key}` 字符串中的 `key`，会过滤掉重复值
 */
export const getVariableNames = (content: string) => {
  return Array.from(new Set(Array.from(content.matchAll(/#\{(.+?)\}/g), ([, key]) => key.trim())))
}

/**
 * 根据对象键值对，替换文本所有匹配到的 `#{key}` 为 `value`
 * @param replaceForNull 当值 `value` 判断为空时，是否替换
 * @default
 * replaceForNull = true
 */
export const replaceTextWithObjectValues = (target: string | undefined, variables: object, replaceForNull = true) => {
  return Object.entries(variables).reduce((content, [key, value]) => {
    if (value || replaceForNull) return content.replaceAll(`#{${key}}`, value || '')
    return content
  }, target || '')
}
