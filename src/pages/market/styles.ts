/* eslint-disable prettier/prettier */
import { SxProps } from '@mui/material'

export default {
  rootPaper: { marginTop: 32 },
  oneStop: {
    p: '52px 48px 97px ',
    background: '#FFFFFF',
    borderRadius: 20,

  },
  poolsBox: {
    p: '37px 48px 90px',
    background: 'var(--ps-gray-900)',
    borderRadius: 20,
    position: 'relative',
    top: -55
  },
  nftBox: {
    p: '37px 48px 49px',
    background: '#FFFFFF',
    borderRadius: 20,
    position: 'relative',
    top: -110
  }
} as Record<string, SxProps>
