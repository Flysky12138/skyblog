import fs from 'node:fs'
import path from 'node:path'

const [target, link] = process.argv.slice(2)

fs.rmSync(link, { force: true, recursive: true })

fs.symlinkSync(path.resolve(target), path.resolve(link), 'junction')

console.log('\nlinked:', link, '->', target, '\n')
