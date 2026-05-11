import { z } from 'zod'
import { zhCN } from 'zod/v4/locales'

export const register = () => {
  z.config(zhCN())
}
