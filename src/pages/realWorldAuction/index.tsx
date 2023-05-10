import { Box, SxProps, Theme } from '@mui/material'
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
        <ComingSoon prompt="The real world collectibles auction will be available soon. Please stay tuned." />
      </Box>
      <FooterPc />
    </>
  )
}
