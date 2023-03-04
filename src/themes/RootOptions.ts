import type { PaletteOptions, ThemeOptions } from '@mui/material'
import { ComponentOptions } from './components'
import { IThemeColor } from './options/color'
import TypographyOptions from './options/typography'

export const RootThemes: ThemeOptions = {
  ...ComponentOptions,
  typography: TypographyOptions,
  spacing: 1,
  shape: {
    borderRadius: 1
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 860,
      lg: 1200,
      xl: 1440
    }
  }
}

export const CustomTheme = (colors: IThemeColor, extra?: PaletteOptions) => {
  return {
    palette: {
      ...extra,
      divider: colors.text,
      primary: {
        main: colors.primary,
        contrastText: colors.text
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.text
      },
      info: {
        main: colors['gray-50'],
        contrastText: colors['gray-700']
      },
      success: {
        main: colors.success,
        contrastText: colors.text
      },
      warning: {
        main: colors.warn,
        contrastText: colors.text
      },
      error: {
        main: colors.error,
        contrastText: colors.text
      }
    }
  }
}
