import { SxProps } from '@mui/material'

export default {
  avatarBox: {
    position: 'absolute',
    top: '-80px'
  },
  avatar: {
    width: 192,
    height: 192,
    padding: 0,
    border: '6px solid #FFFFFF',
    background: '#FFFFFF'
  },
  defaultAva: {
    width: 192,
    height: 192,
    padding: 0,
    border: '6px solid #FFFFFF',
    background: '#FFDC01',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
} as Record<string, SxProps>
