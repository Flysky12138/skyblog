import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const API_FOLDER_PATH = url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))
const OUTPUT_FILE_PATH = url.fileURLToPath(new URL('../api.d.ts', import.meta.url))

const apis: string[] = []
const requests = new Map<string, {}>()

for (const _path of fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = path.join(API_FOLDER_PATH, _path)

  if (!fs.statSync(apiFileFullPath).isFile()) continue
  if (!_path.endsWith(`${path.sep}route.ts`)) continue

  const api = path.posix.join(...['api'].concat(_path.split(path.sep).slice(0, -1)))
  apis.push(`'${api}'`)

  const modules = await import(apiFileFullPath)
  for (const mode of ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'] satisfies Method[]) {
    if (!Reflect.has(modules, mode)) continue
    requests.set(`'${mode} ${api}'`, `import('@/app/api/${_path}').${mode}`)
  }
}

const data = `/**
 * 根据 Nextjs 文件路由系统规则生成
 * @generator [${path.basename(import.meta.url)}](${import.meta.url})
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

fs.writeFileSync(OUTPUT_FILE_PATH, data, { encoding: 'utf-8' })
