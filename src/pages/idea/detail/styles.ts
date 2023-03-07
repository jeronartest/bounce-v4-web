import { SxProps } from '@mui/material'

export default {
  rootPaper: {
    mt: 60,
    borderRadius: 20
  },
  startUp: {
    fontSize: 24,
    lineHeight: '32px'
  },
  ideaTitle: {
    fontSize: 30,
    lineHeight: '38px',
    mt: 16
  },
  files: {
    mt: 80
  },
  profilePaper: {
    borderRadius: 20,
    mt: 24,
    p: 48
  },

  degree: {
    '& p': {
      padding: '7px 12px',
      borderRadius: 28,
      background: 'var(--ps-gray-50)'
    }
  },
  linkBox: {
    '& button': {
      border: '1px solid #D5D5D5'
    }
  },
  idea: {
    padding: '40px 48px 48px',
    borderTop: '1px solid rgba(23, 23, 23, 0.1)'
  },

  comments: {
    padding: '52px 48px 48px',
    borderRadius: 20,
    mt: 24
  },
  like: {
    p: '7px 16px',
    borderRadius: 16,
    background: '#F5F5F5',
    color: 'var(--ps-gray-900)'
  },
  activeLike: {
    background: 'var(--ps-gray-900)',
    color: '#FFFFFF',
    '&:hover': {
      background: 'var(--ps-gray-900)',
      color: '#FFFFFF'
    }
  }
} as Record<string, SxProps>
