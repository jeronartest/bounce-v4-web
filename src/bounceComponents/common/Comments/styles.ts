import { SxProps } from '@mui/material'

export default {
  commentTitle: {
    fontSize: 24,
    lineHeight: '32px'
  },
  accord: {
    boxShadow: 'none',
    mt: '8px !important',
    '&:before': {
      display: 'none'
    },
    '& div.Mui-expanded': {
      minHeight: 0
    }
  },
  accordSummary: {
    background: '#F5F5F5',
    borderRadius: 12,
    minHeight: 0,
    padding: '0px 8px',
    '& div.MuiAccordionSummary-content': {
      margin: 0
    }
  },
  accordDetail: {
    ml: 20
  }
} as Record<string, SxProps>
