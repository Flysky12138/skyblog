import { initialLanguage2ZhCN } from '@repo/monaco-editor'
import { z } from 'zod'
import { zhCN } from 'zod/v4/locales'

z.config(zhCN())

initialLanguage2ZhCN(process.env.NEXT_PUBLIC_CDN_MONACO_EDITOR)
