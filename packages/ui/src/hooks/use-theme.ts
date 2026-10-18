import { MoonStarIcon, SunIcon, SunMoonIcon } from 'lucide-react'
import { useTheme as useThemeContext } from 'next-themes'
import { ToasterProps } from 'sonner'

type Theme = NonNullable<ToasterProps['theme']>

const themeQueue: Theme[] = ['light', 'dark', 'system']

export function useTheme() {
  const { resolvedTheme, setTheme, theme } = useThemeContext()

  const currentTheme = theme as Theme
  const isDark = resolvedTheme === 'dark'

  // 切换主题
  const toggleTheme = (theme?: Theme) => {
    if (theme) {
      setTheme(theme)
      return
    }

    const index = themeQueue.indexOf(theme ?? currentTheme)
    const nextTheme = themeQueue[(index + 1) % themeQueue.length]
    setTheme(nextTheme)
  }

  // 根据当前主题返回对应的图标
  const ThemeIcon = (() => {
    switch (currentTheme) {
      case 'dark':
        return MoonStarIcon
      case 'light':
        return SunIcon
      default:
        return SunMoonIcon
    }
  })()

  // 文本
  const themeText = (() => {
    switch (currentTheme) {
      case 'dark':
        return '深色'
      case 'light':
        return '浅色'
      default:
        return '跟随系统'
    }
  })()

  return {
    /**
     * 是否是深色主题
     */
    isDark,
    theme: currentTheme,
    /**
     * 主题图标
     */
    ThemeIcon,
    /**
     * 获取当前主题的文本
     */
    themeText,
    /**
     * 切换主题
     */
    toggleTheme
  }
}
