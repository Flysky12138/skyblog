import { colors } from 'es-toolkit/server'
import fs from 'node:fs'
import path from 'node:path'

const [src, dest] = process.argv.slice(2)

if (!src || !dest) {
  console.error(colors.bgRed('\nUsage:'), 'tsx scripts/cli/cp.ts <src> <dest>\n')
  process.exit(1)
}

const source = path.resolve(src)
const target = path.resolve(dest)

if (!fs.existsSync(source)) {
  console.error(colors.bgRed('\nNOT FOUND'), colors.red(source), '\n')
  process.exit(1)
}

const realSource = fs.realpathSync(source)
const realTarget = (() => {
  try {
    return fs.realpathSync(target)
  } catch {
    return target
  }
})()
if (realSource === realTarget) {
  console.error(colors.bgRed('\nSAME PATH'), colors.red(realSource), '\n')
  process.exit(0)
}

if (fs.statSync(source).isDirectory()) {
  fs.cpSync(source, target, { recursive: true })
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
}

console.log(colors.bgGreenBright('\nCOPIED'), colors.blue(target), '<-', colors.green(source), '\n')
