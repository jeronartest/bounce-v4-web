import { SxProps } from '@mui/material'

export default {
  like: {
    height: 32,
    minWidth: 0,
    background: 'none',
    color: 'var(--ps-gray-900)'
  },
  activeLike: {
    color: '#259C4A',
    '&:hover': {
      color: '#259C4A'
    }
  },
  activeUnlike: {
    color: '#CA2020',
    '&:hover': {
      color: '#CA2020'
    }
  }
} as Record<string, SxProps>
