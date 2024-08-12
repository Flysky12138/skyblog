import _fs from 'node:fs'
import _path from 'node:path'
import _process from 'node:process'
import _url from 'node:url'

const API_FOLDER_PATH = _url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))

const runtime = _process.argv[2] || 'edge'

for (const path of _fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = _path.join(API_FOLDER_PATH, path)

  if (!_fs.statSync(apiFileFullPath).isFile()) continue
  if (!path.endsWith(`${_path.sep}route.ts`)) continue

  const modules = await import(apiFileFullPath)
  if (!Reflect.has(modules, 'runtime')) continue
  if (Reflect.get(modules, 'runtime') == _process.argv[2]) continue

  let source = _fs.readFileSync(apiFileFullPath, { encoding: 'utf-8' })
  source = source.replace(/^export const runtime = [\w'"]+$/m, `export const runtime = '${runtime}'`)
  _fs.writeFileSync(apiFileFullPath, source)

  console.log('\x1b[32m%s\x1b[0m', apiFileFullPath)
}
