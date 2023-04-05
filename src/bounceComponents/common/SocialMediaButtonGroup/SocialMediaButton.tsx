import React, { ReactNode } from 'react'
import { IconButton } from '@mui/material'

const SocialMediaButton = ({ children, href, size }: { children?: ReactNode; href: string; size?: number }) => {
  return (
    <IconButton href={href} target="_blank" sx={{ border: '1px solid rgba(0, 0, 0, 0.27)', width: size, height: size }}>
      {children}
    </IconButton>
  )
}

export default SocialMediaButton
