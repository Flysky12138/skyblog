import '@repo/monaco-editor/style.css'
import { MonacoEditor } from '@repo/monaco-editor'

import tsx from '../index.tsx?raw'

export function App() {
  return <MonacoEditor unstyled className="h-screen" language="tsx" value={tsx} />
}
