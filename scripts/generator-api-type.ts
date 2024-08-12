import _fs from 'node:fs'
import _path from 'node:path'
import _url from 'node:url'

const API_FOLDER_PATH = _url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))
const OUTPUT_FILE_PATH = _url.fileURLToPath(new URL('../api.d.ts', import.meta.url))

const apis: string[] = []
const requests = new Map<string, {}>()

for (const path of _fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = _path.join(API_FOLDER_PATH, path)

  if (!_fs.statSync(apiFileFullPath).isFile()) continue
  if (!path.endsWith(`${_path.sep}route.ts`)) continue

  const api = _path.posix.join(...['api'].concat(path.split(_path.sep).slice(0, -1)))
  apis.push(`'${api}'`)

  const modules = await import(apiFileFullPath)
  for (const mode of ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'] satisfies Method[]) {
    if (!Reflect.has(modules, mode)) continue
    requests.set(`'${mode} ${api}'`, `import('@/app/api/${path}').${mode}`)
  }
}

const data = `/**
 * 根据 Nextjs 文件路由系统规则生成
 * @generator [${_path.basename(import.meta.url)}](${import.meta.url})
 */
enum API {
${apis.map(it => `  ${it}`).join(',\n')}
}

interface ApiMap {
${Array.from(requests)
  .map(it => `  ${it[0]}: ${it[1]}`)
  .join('\n')}
}
`

_fs.writeFileSync(OUTPUT_FILE_PATH, data, { encoding: 'utf-8' })
