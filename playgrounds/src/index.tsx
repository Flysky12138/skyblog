import { ThemeProvider } from '@repo/ui/components-self/theme'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './rich-text-editor/app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
