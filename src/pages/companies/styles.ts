import { SxProps } from '@mui/material'
import BannerPNG from 'assets/imgs/companies/banner.png'

export default {
  root: {},
  head: {
    height: 400,
    background: `url(${BannerPNG})`
  },
  search: {
    pr: 0,
    width: '90%',
    maxWidth: 656,
    '.MuiButton-root': {
      background: 'var(--ps-blue)',
      borderRadius: '0px 30px 30px 0px',
      width: 190,
      flexShrink: 0
    },
    '> fieldset': {
      border: 0
    }
  },
  listRoot: {
    borderRadius: 20,
    minHeight: 500,
    position: 'relative',
    top: -88,
    left: 0,
    right: 0,
    px: 48,
    py: 32
  }
} as Record<string, SxProps>
