import React from 'react'
import { Box, Typography } from '@mui/material'
import { ReactComponent as NoDataSVG } from 'assets/imgs/no_data.svg'

export interface INoDataProps {
  svgColor?: string
  color?: string
  children?: JSX.Element | string | number
}

const NoData: React.FC<INoDataProps> = ({ svgColor, color, children }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <NoDataSVG style={{ maxWidth: '100%', color: svgColor ? svgColor : 'var(--ps-gray-50)', minHeight: 308 }} />
      {children ? (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            m: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      ) : (
        <Typography
          variant="h4"
          color={color ? color : 'var(--ps-gray-300)'}
          sx={{
            position: 'absolute',
            width: 90,
            height: 25,
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            m: 'auto'
          }}
        >
          No data
        </Typography>
      )}
    </Box>
  )
}

export default NoData
