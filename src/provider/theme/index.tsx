'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import {
  getInitColorSchemeScript as getJoyInitColorSchemeScript,
  THEME_ID as JOY_THEME_ID,
  CssVarsProvider as JoyCssVarsProvider,
  SupportedColorScheme
} from '@mui/joy/styles'
import MaterialInitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from '@mui/material/styles'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import joy from './joy'
import mui from './mui'

type ThemeProviderPropsType = Omit<Parameters<typeof JoyCssVarsProvider>[0], 'defaultMode' | 'theme'>

/**
 * - 在同一个项目中一起使用 Joy UI 和 Material UI
 * - 在 App Router 中使用 Joy & Material Components 无需添加 `use client`
 *
 * @see https://mui.com/joy-ui/integrations/next-js-app-router/
 * @see https://mui.com/joy-ui/integrations/material-ui/
 */
export const ThemeProvider = ({ children, ...props }: ThemeProviderPropsType) => {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'theme' })
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] == undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length == 0) return null
    const styles = names.reduce((pre, cur) => pre + cache.inserted[cur], '')
    return <style dangerouslySetInnerHTML={{ __html: styles }} key={cache.key} data-emotion={`${cache.key} ${names.join(' ')}`} />
  })

  const defaultMode: SupportedColorScheme = 'dark'

  return (
    <CacheProvider value={cache}>
      <MaterialCssVarsProvider defaultMode={defaultMode} theme={mui} {...props}>
        <JoyCssVarsProvider defaultMode={defaultMode} theme={{ [JOY_THEME_ID]: joy }} {...props}>
          {process.env.NODE_ENV != 'development' && <MaterialInitColorSchemeScript defaultMode={defaultMode} />}
          {process.env.NODE_ENV != 'development' && getJoyInitColorSchemeScript({ defaultMode })}
          {children}
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </CacheProvider>
  )
}
