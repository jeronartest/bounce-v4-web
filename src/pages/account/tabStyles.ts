import { SxProps } from '@mui/material'

export default {
  tabsBox: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  menu: {
    borderRadius: '20px',
    cursor: 'pointer',
    color: 'rgba(23, 23, 23, 0.5)',
    padding: '16px 32px 40px'
  },
  menuActive: {
    background: '#F5F5F5',
    color: 'var(--ps-gray-900)'
  }
} as Record<string, SxProps>
