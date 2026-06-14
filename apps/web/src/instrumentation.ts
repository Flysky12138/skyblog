import { z } from 'zod'
import { zhCN } from 'zod/v4/locales'

export function register() {
  z.config(zhCN())
}
