import { MonacoEditor } from '@repo/monaco-editor'
import '@repo/monaco-editor/styles.css'
import React from 'react'

export function MonacoEditorPlayground() {
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    void (async () => {
      const module = await import('../index.tsx?raw')
      setValue(module.default)
    })()
  }, [])

  return <MonacoEditor language="tsx" value={value} />
}
