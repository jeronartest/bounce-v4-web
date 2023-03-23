import { Box, SxProps, Typography } from '@mui/material'
import React from 'react'
import Image from 'components/Image'
import Tooltip from '../Tooltip'
import { VerifyStatus } from 'api/profile/type'
import VerifiedSVG from 'assets/imgs/profile/verify.svg'
import NoVerifySVG from 'assets/imgs/profile/no-verify.svg'

export interface IVerifiedIconProps {
  isVerify: VerifyStatus
  width?: number
  height?: number
  showVerify?: boolean
  sx?: SxProps
}

const VerifiedIcon: React.FC<IVerifiedIconProps> = ({ isVerify, width = 20, height = 20, showVerify, sx }) => {
  return (
    <Box sx={sx}>
      {showVerify && isVerify === VerifyStatus.NoVerify && (
        <Tooltip
          title={
            isVerify === VerifyStatus.NoVerify ? (
              <Typography
                // component={Link}
                variant="body2"
                // href="/profile/account/settings"
                // sx={{
                //   textDecoration: 'underline',
                //   '&:hover': {
                //     cursor: 'pointer'
                //   }
                // }}
              >
                No Verified
              </Typography>
            ) : (
              'Verified account'
            )
          }
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image alt="" src={NoVerifySVG} width={width} height={height} />
          </Box>
        </Tooltip>
      )}
      {isVerify === VerifyStatus.Verified && (
        <Tooltip title="Verified account">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image alt="" src={VerifiedSVG} width={width} height={height} />
          </Box>
        </Tooltip>
      )}
    </Box>
  )
}

export default VerifiedIcon
