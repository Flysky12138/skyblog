import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, posix, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_FOLDER_PATH = fileURLToPath(new URL(`../src/app/api`, import.meta.url))
const OUTPUT_FILE_PATH = fileURLToPath(new URL('../api.d.ts', import.meta.url))

const apis: string[] = []
const requests = new Map<string, {}>()

for (const path of readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = join(API_FOLDER_PATH, path)
  if (path.endsWith(`${sep}route.ts`) && statSync(apiFileFullPath).isFile()) {
    const api = posix.join(...['api'].concat(path.split(sep).slice(0, -1)))
    apis.push(`'${api}'`)

    const modules = await import(apiFileFullPath)
    for (const mode of ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'] satisfies Method[]) {
      if (Reflect.has(modules, mode)) {
        requests.set(`'${mode} ${api}'`, `import('@/app/api/${path}').${mode}`)
      }
    }
  }
}

const data = `/**
 * 根据 Nextjs 文件路由系统规则生成
 * @generator [${basename(import.meta.url)}](${import.meta.url})
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

writeFileSync(OUTPUT_FILE_PATH, data, { encoding: 'utf-8' })
