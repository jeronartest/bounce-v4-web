import { SxProps } from '@mui/material'

export default {
  rootPaper: { marginTop: 60 },
  ideasBox: {
    p: '52px 48px 97px ',
    background: '#FFFFFF',
    borderRadius: 20
  },
  companiesBox: {
    p: '37px 48px 90px',
    background: 'var(--ps-gray-900)',
    borderRadius: 20,
    position: 'relative',
    top: -55
  },
  institutionaBox: {
    p: '37px 48px 49px',
    background: '#FFFFFF',
    borderRadius: 20,
    position: 'relative',
    top: -110
  }
} as Record<string, SxProps>
