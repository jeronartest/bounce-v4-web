import { SxProps } from '@mui/material'

export default {
  fileItem: {
    '& label': {
      position: 'absolute',
      left: 184,
      top: 46,
      fontSize: 14,
      color: 'var(--ps-gray-900)',
    },
    '&>p': {
      position: 'absolute',
      left: 184,
      top: 78,
      fontSize: 12,
      color: 'var(--ps-gray-600)',
    },
  },
  iconBtn: {
    background: '#EBECEF',
    width: 40,
    height: 40,
  },
} as Record<string, SxProps>
