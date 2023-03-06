import { SxProps } from '@mui/material'

export default {
  menuBox: {
    background: 'var(--ps-primary)',
    borderRadius: 24,
    padding: '10px 12px',
    height: 'fit-content'
  },
  menu: {
    borderRadius: 24,
    paddingLeft: 21,
    display: 'flex',
    justifyContent: 'flex-start',
    color: 'var(--ps-gray-600)'
  },
  menuActive: {
    color: '#FFFFFF'
  }
} as Record<string, SxProps>
