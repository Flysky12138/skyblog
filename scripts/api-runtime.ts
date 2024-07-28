import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const API_FOLDER_PATH = fileURLToPath(new URL(`../src/app/api`, import.meta.url))

const runtime = argv[2] || 'edge'

for (const path of readdirSync(API_FOLDER_PATH, { recursive: true }) as string[]) {
  const apiFileFullPath = join(API_FOLDER_PATH, path)

  if (!statSync(apiFileFullPath).isFile()) continue
  if (!path.endsWith(`${sep}route.ts`)) continue

  const modules = await import(apiFileFullPath)
  if (!Reflect.has(modules, 'runtime')) continue
  if (Reflect.get(modules, 'runtime') == argv[2]) continue

  let source = readFileSync(apiFileFullPath, { encoding: 'utf-8' })
  source = source.replace(/^export const runtime = [\w'"]+$/m, `export const runtime = '${runtime}'`)
  writeFileSync(apiFileFullPath, source)

  console.log('\x1b[32m%s\x1b[0m', apiFileFullPath)
}
