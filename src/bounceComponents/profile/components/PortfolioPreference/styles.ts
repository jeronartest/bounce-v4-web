import { SxProps } from '@mui/material'

export default {
  tabsBox: {
    marginTop: 40,
    display: 'flex'
  },
  tabsRoot: {
    '.MuiTab-root': {
      padding: 20,
      textTransform: 'none',
      fontSize: 14,
      color: '#000000',
      border: '1px solid #D7D6D9',
      borderRadius: 30,
      marginRight: 10,

      '&.Mui-selected': {
        color: '#FFFFFF',
        background: '#000000'
      }
    },
    '.MuiTabs-indicator': {
      display: 'none'
    }
  }
} as Record<string, SxProps>
