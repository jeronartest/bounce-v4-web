import { ReactNode } from 'react'
import { Box } from '@mui/material'

export interface MaskIconProps {
  children: ReactNode
  isVisible?: boolean
}

const MaskIcon = ({ children, isVisible = false }: MaskIconProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        display: isVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        '&:hover': {
          display: 'flex'
        }
      }}
    >
      {children}
    </Box>
  )
}

export default MaskIcon
