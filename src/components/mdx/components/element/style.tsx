'use client'

import { isBrowser } from 'es-toolkit'
import React from 'react'
import ReactDOM from 'react-dom'

export function Style(props: React.ComponentProps<'style'>) {
  if (!isBrowser()) return <style {...props} />

  return ReactDOM.createPortal(<style {...props} />, document.head)
}
