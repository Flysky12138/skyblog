import { useTheme as useThemeContext } from 'next-themes'
import { ToasterProps } from 'sonner'

export const useTheme = () => {
  const { resolvedTheme, setTheme, systemTheme, theme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    /** 是否是深色主题 */
    isDark,
    setTheme,
    systemTheme,
    theme: theme as ToasterProps['theme'],
    /** 切换主题 */
    toggleTheme
  }
}
