import { createTheme } from '@mui/material/styles'
import breakpoints from './breakpoints'

export default createTheme({
  breakpoints,
  colorSchemes: {
    dark: true,
    light: true
  },
  components: {
    MuiPagination: {
      defaultProps: {
        color: 'secondary',
        shape: 'rounded',
        variant: 'outlined'
      },
      styleOverrides: {
        ul: {
          '.MuiPaginationItem-ellipsis': {
            userSelect: 'none'
          }
        }
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small'
      }
    }
  },
  cssVariables: {
    colorSchemeSelector: 'class'
  },
  defaultColorScheme: 'light',
  spacing: (factor: number) => `${0.25 * factor}rem`, // same with tailwindcss
  typography: {
    fontFamily: 'inherit'
  }
})
