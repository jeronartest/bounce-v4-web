import { SxProps } from '@mui/material'

export default {
  root: {
    height: 86,
    boxShadow: 'none',
    justifyContent: 'center'
  },
  menu: {
    fontSize: 16,
    boxShadow: '0 0 0 0',
    color: 'var(--ps-text)',
    'a:hover': {
      opacity: 0.6
    }
  },
  menuActive: {
    boxShadow: '0px 1px 0px 0px var(--ps-text)'
  }
} as Record<string, SxProps>
