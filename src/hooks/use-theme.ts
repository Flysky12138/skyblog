import { useTheme as useThemeContext } from 'next-themes'

type ThemeType = 'dark' | 'light' | 'system'

export const useTheme = () => {
  const { resolvedTheme, setTheme, systemTheme, theme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    isDark,
    setTheme,
    systemTheme,
    theme: theme as ThemeType,
    toggleTheme
  }
}
