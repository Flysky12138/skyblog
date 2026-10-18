import 'zod/compile'
import { initialLanguage2ZhCN } from '@repo/monaco-editor'
import z from 'zod'
import { zhCN } from 'zod/v4/locales'

import { rpc } from './lib/http/rpc'

z.config(zhCN())

initialLanguage2ZhCN(process.env.NEXT_PUBLIC_CDN_MONACO_EDITOR)

if (process.env.NODE_ENV === 'production') {
  void rpc.analytics.visit.post()
}
