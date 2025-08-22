import Fs from 'node:fs'
import Path from 'node:path'
import Url from 'node:url'

const API_FOLDER_PATH = Url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))
const OUTPUT_FILE_PATH = Url.fileURLToPath(new URL('../routes.d.ts', import.meta.url))

const AppRouteHandlerMethodMap = new Map<string, {}>()

for (const path of Fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const fullPath = Path.join(API_FOLDER_PATH, path)

  if (!Fs.statSync(fullPath).isFile()) continue
  if (!path.endsWith(`${Path.sep}route.ts`)) continue

  const routes = Path.posix.join(...[Path.sep, 'api'].concat(path.split(Path.sep).slice(0, -1)))

  const modules = await import(fullPath)
  for (const mode of ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'] satisfies Method[]) {
    if (!Reflect.has(modules, mode)) continue
    AppRouteHandlerMethodMap.set(`'${mode} ${routes}'`, `import('@/app/api/${path}').${mode}`)
  }
}

const data = `/**
 * 根据 Nextjs 文件路由系统规则生成
 * @generator [${Path.basename(import.meta.url)}](${import.meta.url})
 */
interface AppRouteHandlerMethodMap {
${Array.from(AppRouteHandlerMethodMap)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(item => `  ${item[0]}: ${item[1]}`)
  .join('\n')}
}
`

Fs.writeFileSync(OUTPUT_FILE_PATH, data, { encoding: 'utf-8' })
