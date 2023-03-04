import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Box, SxProps, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import Tooltip from '@/components/common/Tooltip'

const SubTitle = ({ children }: { children: ReactNode }): JSX.Element => (
  <Typography variant="body2" sx={{ color: '#908E96' }}>
    {children}
  </Typography>
)

interface PoolInfoItemProps {
  title: string
  tip?: string
  children?: ReactNode
  sx?: SxProps
}

const PoolInfoItem = ({ title, tip, children, sx }: PoolInfoItemProps): JSX.Element => {
  return (
    <Box sx={{ ...sx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#908E96' }}>
        <SubTitle>{title}</SubTitle>
        {tip ? (
          <Tooltip title={tip}>
            <HelpOutlineIcon sx={{ width: 20, height: 20, ml: 4 }} />
          </Tooltip>
        ) : null}
      </Box>

      {children}
    </Box>
  )
}

export default PoolInfoItem
