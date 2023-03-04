import { SxProps } from '@mui/material'

export default {
  tabsBox: {
    background: 'var(--ps-primary)',
    borderRadius: 24,
    padding: '2px 12px 10px',
    height: 'fit-content',
  },
  tabsRoot: {
    '.MuiTab-root': {
      background: 'var(--ps-gray-50)',
      height: 72,
      borderRadius: 24,
      paddingLeft: 22,
      textAlign: 'left',
      alignItems: 'flex-start',
      marginTop: 8,
      color: 'var(--ps-gray-600)',
      fontFamily: '"Sharp Grotesk DB Cyr Medium 22"',
      fontSize: 16,
      lineHeight: '20px',
      textTransform: 'none',
      '&.Mui-selected': {
        color: 'var(--ps-primary)',
        background: 'var(--ps-gray-900)',
      },
    },
    '.MuiTabs-indicator': {
      display: 'none',
    },
  },
} as Record<string, SxProps>
