import { LaptopMinimalIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { useTheme as useThemeContext } from 'next-themes'
import React from 'react'
import { ToasterProps } from 'sonner'

type Theme = NonNullable<ToasterProps['theme']>

export const useTheme = () => {
  const { resolvedTheme, setTheme, theme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  // 切换主题，按照 themeQueue 的顺序切换
  const toggleTheme = (theme: Theme) => {
    setTheme(theme)
  }

  // 根据当前主题返回对应的图标
  const ThemeIcon = React.useMemo(() => {
    switch (theme as Theme) {
      case 'dark':
        return MoonStarIcon
      case 'light':
        return SunIcon
      default:
        return LaptopMinimalIcon
    }
  }, [theme])

  return {
    /** 是否是深色主题 */
    isDark,
    theme: theme as Theme,
    /** 主题图标 */
    ThemeIcon,
    /** 切换主题 */
    toggleTheme
  }
}
