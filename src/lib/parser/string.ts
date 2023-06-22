/**
 * 解析文本所有 `#{key}` 字符串中的 `key`，会过滤掉重复值
 */
export const getVariablesNames = (content: string) => {
  return Array.from(new Set(Array.from(content.matchAll(/#\{(.+?)\}/g), ([, key]) => key.trim())))
}

/**
 * 根据对象键值对，给文本中的变量 `#{key}` 替换为 `value`
 * @param setForNull 当值 `value` 判断为 `false` 时，是否替换
 * @default
 * setForNull = true
 */
export const replaceVariables = (target = '', variables: object, setForNull = true) => {
  for (const [key, value] of Object.entries(variables)) {
    if (value || setForNull) {
      target = target.replaceAll(`#{${key}}`, value || '')
    }
  }
  return target
}
