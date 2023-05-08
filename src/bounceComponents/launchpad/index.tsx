import React from 'react'
import { Box, styled, SxProps } from '@mui/material'
import Temp from 'assets/imgs/companies/banner.png'

const CommonBg = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 1320px;
  height: 400px;
  background: #20201e;
  border-radius: 30px;
`

export function Common({ img, child, sx }: { img: string; child: React.ReactElement; sx?: SxProps }) {
  return (
    <CommonBg sx={sx} mb={24}>
      <img style={{ width: '600px', backgroundSize: 'cover', borderRadius: '30px 0 0 30px' }} src={img || Temp} />
      <Box sx={{ width: '100%', height: '100%' }}>{child}</Box>
    </CommonBg>
  )
}
