import { SxProps } from '@mui/material'

export default {
  tabsBox: {
    marginTop: 40,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 20px'
  },
  menu: {
    paddingBottom: 9,
    cursor: 'pointer',
    color: 'rgba(23, 23, 23, 0.5)'
  },
  menuActive: {
    borderBottom: '2px solid #000',
    color: 'var(--ps-gray-900)'
  }
} as Record<string, SxProps>
