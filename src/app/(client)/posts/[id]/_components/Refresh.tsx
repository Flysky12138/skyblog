'use client'

import { useEvent } from 'react-use'

export const REFRESH_MESSAGE = 'refresh'

/**
 * 后台更新内容，刷新界面
 */
export default function Refresh() {
  useEvent('message', ({ data, origin }) => {
    if (data == REFRESH_MESSAGE && origin == window.origin) {
      window.location.reload()
    }
  })

  return null
}
