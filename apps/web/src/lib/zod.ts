import { FieldErrors } from 'react-hook-form'

/**
 * 滚动到第一个错误输入框
 */
export function scrollToError(errors: FieldErrors) {
  const name = Object.keys(errors)[0]
  const el = document.querySelector<HTMLInputElement>(`[name="${name}"]`)
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
  el.focus({
    preventScroll: true
  })
}
