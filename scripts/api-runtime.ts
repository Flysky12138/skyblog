import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'

const API_FOLDER_PATH = url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))

const runtime = process.argv[2] || 'edge'

for (const _path of fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = path.join(API_FOLDER_PATH, _path)

  if (!fs.statSync(apiFileFullPath).isFile()) continue
  if (!_path.endsWith(`${path.sep}route.ts`)) continue

  const modules = await import(apiFileFullPath)
  if (!Reflect.has(modules, 'runtime')) continue
  if (Reflect.get(modules, 'runtime') == process.argv[2]) continue

  let source = fs.readFileSync(apiFileFullPath, { encoding: 'utf-8' })
  source = source.replace(/^export const runtime = [\w'"]+$/m, `export const runtime = '${runtime}'`)
  fs.writeFileSync(apiFileFullPath, source)

  console.log('\x1b[32m%s\x1b[0m', apiFileFullPath)
}
