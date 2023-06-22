import { sliderClasses } from '@mui/joy/Slider'
import { extendTheme } from '@mui/joy/styles'
import breakpoints from './breakpoints'

export default extendTheme({
  breakpoints,
  components: {
    JoyFormControl: {
      defaultProps: {
        color: 'neutral'
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '--joy-palette-neutral-outlinedBorder': theme.palette.primary.outlinedBorder
        })
      }
    },
    JoyIconButton: {
      defaultProps: {
        color: 'primary',
        size: 'sm',
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '--IconButton-radius': '10px'
        }
      }
    },
    JoyInput: {
      defaultProps: {
        autoComplete: 'off',
        spellCheck: 'false'
      }
    },
    JoyModalDialog: {
      defaultProps: {
        variant: 'plain'
      },
      styleOverrides: {
        root: {
          '--ModalDialog-padding': '20px'
        }
      }
    },
    JoySlider: {
      styleOverrides: {
        root: {
          [`& [style*="left:0%"], & [style*="left: 0%"]`]: {
            [`&.${sliderClasses.markLabel}`]: {
              transform: 'none'
            },
            [`& .${sliderClasses.valueLabel}`]: {
              '&::before': {
                borderLeftColor: 'currentColor',
                left: 0,
                transform: 'translateY(100%)'
              },
              borderBottomLeftRadius: 0,
              left: 'calc(var(--Slider-thumbSize) / 2)'
            }
          },
          [`& [style*="left:100%"], & [style*="left: 100%"]`]: {
            [`&.${sliderClasses.markLabel}`]: {
              transform: 'translateX(-100%)'
            },
            [`& .${sliderClasses.valueLabel}`]: {
              '&::before': {
                borderRightColor: 'currentColor',
                left: 'initial',
                right: 0,
                transform: 'translateY(100%)'
              },
              borderBottomRightRadius: 0,
              right: 'calc(var(--Slider-thumbSize) / 2)'
            }
          },
          userSelect: 'none'
        }
      }
    },
    JoyTabs: {
      defaultProps: {
        size: 'sm'
      }
    },
    JoyTooltip: {
      defaultProps: {
        arrow: true,
        size: 'sm'
      },
      styleOverrides: {
        root: {
          padding: '2px 6px'
        }
      }
    }
  },
  fontFamily: {
    body: 'inherit',
    display: 'inherit'
  },
  spacing: (factor: number) => `${0.25 * factor}rem` // same with tailwindcss
})
