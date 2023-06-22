import { useTheme as useThemeContext } from 'next-themes'

type ThemeType = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    isDark,
    setTheme,
    systemTheme,
    toggleTheme,
    theme: theme as ThemeType
  }
}
