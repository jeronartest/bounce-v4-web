import { Box, SxProps, Theme } from '@mui/material'
import HeaderTab from 'bounceComponents/auction/HeaderTab'
import ComingSoon from 'pages/ComingSoon'
import FooterPc from 'components/Footer/FooterPc'

export default function AdsAuction({ sx }: { sx?: SxProps<Theme> | undefined }) {
  return (
    <>
      <Box
        sx={{
          padding: '0 60px 40px',
          ...sx
        }}
      >
        <HeaderTab />
        <ComingSoon sx={{ marginTop: '30px' }} prompt={'The Ads Auction will be available soon. Please stay tuned.'} />
      </Box>
      <FooterPc />
    </>
  )
}
