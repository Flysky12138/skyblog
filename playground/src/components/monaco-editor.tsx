import '@repo/monaco-editor/style.css'
import { MonacoEditor } from '@repo/monaco-editor'

import tsx from '../index.tsx?raw'

export function MonacoEditorPlayground() {
  return <MonacoEditor language="tsx" value={tsx} />
}
