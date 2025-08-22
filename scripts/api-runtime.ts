import Fs from 'node:fs'
import Path from 'node:path'
import Process from 'node:process'
import Url from 'node:url'

const API_FOLDER_PATH = Url.fileURLToPath(new URL(`../src/app/api`, import.meta.url))

const runtime = Process.argv[2] || 'edge'

for (const path of Fs.readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = Path.join(API_FOLDER_PATH, path)

  if (!Fs.statSync(apiFileFullPath).isFile()) continue
  if (!path.endsWith(`${Path.sep}route.ts`)) continue

  const modules = await import(apiFileFullPath)
  if (!Reflect.has(modules, 'runtime')) continue
  if (Reflect.get(modules, 'runtime') == Process.argv[2]) continue

  let source = Fs.readFileSync(apiFileFullPath, { encoding: 'utf-8' })
  source = source.replace(/^export const runtime = [\w'"]+$/m, `export const runtime = '${runtime}'`)
  Fs.writeFileSync(apiFileFullPath, source)

  console.log('\x1b[32m%s\x1b[0m', apiFileFullPath)
}
