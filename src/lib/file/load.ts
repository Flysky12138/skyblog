/**
 * 加载 JS 脚本
 * @param source JS 文件地址
 */
export const loadJSFile = (source: StartsWith<'/' | Protocol>) => {
  const el = Object.assign(document.createElement('script'), { async: true, src: source })
  document.head.append(el)
  return new Promise((resolve, reject) => {
    el.addEventListener('load', () => {
      el.remove()
      resolve(el)
    })
    el.addEventListener('error', () => {
      el.remove()
      reject(el)
    })
  })
}
