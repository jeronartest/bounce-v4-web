import { Box, SxProps, Theme, Typography } from '@mui/material'
import HeaderTab from 'bounceComponents/auction/HeaderTab'
import ComingSoon from 'pages/ComingSoon'
import FooterPc from 'components/Footer/FooterPc'

export default function RealWorldAuction({ sx }: { sx?: SxProps<Theme> | undefined }) {
  return (
    <>
      <Box
        sx={{
          padding: '0 60px 40px',
          ...sx
        }}
      >
        <HeaderTab />
        <ComingSoon />
        <Typography
          sx={{
            fontFamily: `'Inter'`,
            fontSize: 14,
            textAlign: 'center'
          }}
        >
          The real world collectibles auction will be available soon. Please stay tuned.
        </Typography>
      </Box>
      <FooterPc />
    </>
  )
}
