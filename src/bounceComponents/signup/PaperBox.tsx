import { Box, IconButton, Paper, SxProps, Typography } from '@mui/material'
import React from 'react'
import { ReactComponent as BackSVG } from './assets/back.svg'
export type IPaperBoxProps = {
  back?: boolean
  title: string
  subTitle?: React.ReactNode
  children?: React.ReactNode
  sx?: SxProps
}

const PaperBox: React.FC<IPaperBoxProps> = ({ back = true, title, subTitle, children, sx }) => {
  return (
    <Paper sx={{ ...sx, borderRadius: '24px' }} elevation={0}>
      <Box sx={{ height: 46 }}>
        {back && (
          <IconButton
            sx={{ bgcolor: 'var(--ps-gray-50)', width: 46, height: 46 }}
            onClick={() => {
              history.back()
            }}
          >
            <BackSVG />
          </IconButton>
        )}
      </Box>

      <Typography variant="h2" textAlign="center" color="var(--ps-gray-900)">
        {title}
      </Typography>

      {subTitle && (
        <Typography variant="body2" textAlign="center" color="var(--ps-gray-600)" sx={{ pt: 16 }}>
          {subTitle}
        </Typography>
      )}

      {children}
    </Paper>
  )
}

export default PaperBox
