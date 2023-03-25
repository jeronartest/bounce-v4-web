import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export type ISettingsBoxProps = {
  title: string
  children: React.ReactNode
  paddingTop?: number
}

const SettingsBox: React.FC<ISettingsBoxProps> = ({ title, children, paddingTop = 40 }) => {
  return (
    <Box sx={{ pt: paddingTop }}>
      <Typography variant="h5" color={'var(--ps-gray-900)'}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default SettingsBox
