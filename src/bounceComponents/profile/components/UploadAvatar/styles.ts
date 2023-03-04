import { SxProps } from '@mui/material'

export default {
  fileItem: {
    '& label': {
      position: 'absolute',
      left: 264,
      top: 46,
      fontSize: 14,
      color: 'var(--ps-gray-900)',
    },
    '&>p': {
      position: 'absolute',
      left: 264,
      top: 78,
      fontSize: 12,
      color: 'var(--ps-gray-600)',
    },
  },
} as Record<string, SxProps>
