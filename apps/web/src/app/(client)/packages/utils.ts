import fs from 'node:fs'

/**
 * 获取依赖信息
 */
export const getPackageInfo = ([name, version]: [string, string]) => {
  const pkg = fs.readFileSync(new URL(`../../../../node_modules/${name}/package.json`, import.meta.url), 'utf8')

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
