import { colors } from 'es-toolkit/server'
import fs from 'node:fs'
import path from 'node:path'

const [target, link] = process.argv.slice(2)

if (!target || !link) {
  console.error(colors.bgRed('\nUsage:'), 'tsx scripts/cli/symlink.ts <target> <link>\n')
  process.exit(1)
}

const source = path.resolve(target)
const dest = path.resolve(link)

if (!fs.existsSync(source)) {
  console.error(colors.bgRed('\nNOT FOUND'), colors.red(source), '\n')
  process.exit(1)
}

fs.rmSync(dest, { force: true, recursive: true })
fs.symlinkSync(source, dest, 'junction')

console.log(colors.bgGreenBright('\nLINKED'), colors.blue(dest), '->', colors.green(source), '\n')
