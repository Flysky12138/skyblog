import { useColorScheme as useJoyColorScheme } from '@mui/joy/styles'
import { useColorScheme as useMaterialColorScheme } from '@mui/material/styles'

export default function useTheme() {
  const { mode, setMode: setJoyMode, systemMode } = useJoyColorScheme()
  const { setMode: setMaterialMode } = useMaterialColorScheme()

  const isDark = (mode == 'system' ? systemMode : mode) == 'dark'
  const setTheme = (theme: NonNullable<typeof mode>) => {
    setJoyMode(theme)
    setMaterialMode(theme)
  }
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  return {
    isDark,
    setTheme,
    toggleTheme
  }
}
