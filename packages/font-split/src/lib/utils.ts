import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * 更新 package.json 的 exports
 */
export function updatePackageExports({
  exportsMap,
  packageJsonPath = './package.json'
}: {
  exportsMap: Record<string, string>
  packageJsonPath?: string
}) {
  packageJsonPath = fileURLToPath(new URL(packageJsonPath, import.meta.url))

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { exports?: object }

  pkg.exports ??= {}

  Object.assign(pkg.exports, exportsMap)

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')

  return pkg.exports
}
