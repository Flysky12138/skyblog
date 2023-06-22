import { fontSplit } from '@konghayao/cn-font-split'
import { readFileSync } from 'node:fs'

const url = new URL('./MiSans L3.woff2', import.meta.url)

fontSplit({
  FontPath: readFileSync(url),
  chunkSize: 70 * 1024,
  css: {},
  destFold: 'scripts/fontSplit/font' + decodeURIComponent(url.href.slice(url.href.lastIndexOf('/')).split('.')[0]) + '/',
  reporter: false,
  targetType: 'woff',
  testHTML: false,
  threads: {}
})
