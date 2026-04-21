import { LaptopMinimalIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { useTheme as useThemeContext } from 'next-themes'
import React from 'react'
import { ToasterProps } from 'sonner'

type Theme = NonNullable<ToasterProps['theme']>

export const useTheme = () => {
  const { resolvedTheme, setTheme, theme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  // 维护一个 themeQueue 来记录主题切换的顺序
  const themeQueue = React.useRef<Theme[]>(['light', 'dark', 'system'])

  // 保持 themeQueue 的顺序与 theme 一致，确保 toggleTheme 能正确切换到下一个主题
  const isChanged = React.useRef(false)
  React.useEffect(() => {
    if (isChanged.current) return
    isChanged.current = true
    while (true) {
      if (themeQueue.current.at(-1) == theme) break
      themeQueue.current.push(themeQueue.current.shift()!)
    }
  }, [theme])

  // 切换主题，按照 themeQueue 的顺序切换
  const toggleTheme = () => {
    const nextTheme = themeQueue.current.shift()!
    themeQueue.current.push(nextTheme)
    setTheme(nextTheme)
  }

  // 根据当前主题返回对应的图标
  const themeIcon = React.useMemo(() => {
    switch (theme as Theme) {
      case 'dark':
        return <MoonStarIcon />
      case 'light':
        return <SunIcon />
      default:
        return <LaptopMinimalIcon />
    }
  }, [theme])

  return {
    /** 是否是深色主题 */
    isDark,
    theme: theme as Theme,
    /** 主题图标 */
    themeIcon,
    /** 切换主题 */
    toggleTheme
  }
}
