import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import breakpoints from './breakpoints'

export default extendTheme({
  breakpoints,
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
  spacing: (factor: number) => `${0.25 * factor}rem`, // same with tailwindcss
  typography: {
    fontFamily: 'inherit'
  }
})
