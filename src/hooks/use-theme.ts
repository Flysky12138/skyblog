import { useTheme as useThemeContext } from 'next-themes'
import React from 'react'

type ThemeType = 'dark' | 'light' | 'system'

export const useTheme = () => {
  const { resolvedTheme, setTheme, systemTheme, theme } = useThemeContext()

  const isDark = resolvedTheme == 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const animateToggleTheme = async (event: React.MouseEvent<HTMLElement>) => {
    const VIEW_TRANSITION_NAME = 'theme'
    try {
      const { clientX: x, clientY: y } = event
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.style.viewTransitionName = VIEW_TRANSITION_NAME
      const transition = document.startViewTransition(toggleTheme)
      await transition.ready
      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : clipPath.reverse()
        },
        {
          duration: 600,
          easing: 'ease-in',
          pseudoElement: isDark ? `::view-transition-new(${VIEW_TRANSITION_NAME})` : `::view-transition-old(${VIEW_TRANSITION_NAME})`
        }
      )
    } catch (error) {
      toggleTheme()
      console.error(error)
    }
  }

  return {
    /** 主题切换动画 */
    animateToggleTheme,
    /** 是否是深色主题 */
    isDark,
    setTheme,
    systemTheme,
    theme: theme as ThemeType,
    /** 切换主题 */
    toggleTheme
  }
}
