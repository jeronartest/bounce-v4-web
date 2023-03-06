import { SxProps } from '@mui/material'

export default {
  uploadBox: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(3px)',
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  item: {
    position: 'relative',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--ps-borderDark)',
    '&:hover': {
      borderColor: 'var(--ps-text)'
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%'
    }
  },
  removeBtn: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 24,
    height: 24,
    p: 0,
    bgcolor: 'var(--ps-darkBrown)',
    border: '1px solid var(--ps-borderDark)',
    '&:hover': {
      borderColor: 'var(--ps-text)'
    }
  },
  imgBox: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: '50%',
    overflow: 'hidden'
  },
  addItem: {
    border: '1px solid #D7D6D9',
    borderRadius: '50%',
    width: '100%',
    height: '100%',
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    height: '100%',
    width: '100%'
  },
  editBox: {
    position: 'relative',
    borderRadius: '50%',
    overflow: 'hidden',
    '&:hover': {
      '& p': {
        display: 'block'
      }
    }
  },
  edit: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(3px)',
    color: 'var(--ps-gray-900)',
    width: '100%',
    padding: 10,
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    display: 'none',
    pointerEvents: 'none'
  },

  fileBox: {
    border: ' 1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
    width: 355,
    height: 84,
    padding: 16,
    '&:hover': {
      boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(23, 23, 23, 0.2)'
    }
  }
} as Record<string, SxProps>
