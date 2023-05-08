import { Box, SxProps, Theme } from '@mui/material'
import HeaderTab from 'bounceComponents/auction/HeaderTab'
import ComingSoon from 'pages/ComingSoon'

export default function RealWorldAuction({ sx }: { sx?: SxProps<Theme> | undefined }) {
  return (
    <Box
      sx={{
        padding: '0 60px 40px',
        ...sx
      }}
    >
      <HeaderTab />
      <ComingSoon />
    </Box>
  )
}
