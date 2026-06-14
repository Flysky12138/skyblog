import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function getPackageInfo([name, version]: [string, string]) {
  const pkgPath = resolve(process.cwd(), 'node_modules', name, 'package.json')
  const pkg = readFileSync(pkgPath, 'utf8')

  const pkgJson = JSON.parse(pkg) as {
    homepage?: string
    name: string
    version: string
  }

  if (pkgJson.name.startsWith('@repo/')) {
    pkgJson.homepage = `https://github.com/Flysky12138/skyblog/tree/main/packages/${pkgJson.name.replace('@repo/', '')}`
    pkgJson.version = version
  }

  return pkgJson
}
