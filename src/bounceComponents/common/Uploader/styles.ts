import { SxProps } from '@mui/material'

export default {
  root: {
    position: 'relative',
    display: 'inline-block'
  },
  uploaderFile: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: '20',
    width: '100%',
    height: '100%',
    margin: 'auto',
    overflow: 'hidden',
    borderRadius: 'inherit',

    'input[type=file]': {
      display: 'block',
      width: '100%',
      height: '100%',
      paddingTop: '1000px',
      cursor: 'pointer'
    },

    '> img': {
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      maxWidth: '50%',
      maxHeight: '50%',
      margin: 'auto',
      pointerEvents: 'none'
    }
  },
  uploaderFileMasked: {
    backgroundColor: 'var(--ps-borderDark)'
  }
} as Record<string, SxProps>
