import { Box, Container, Typography } from '@mui/material'
import Image from 'components/Image'
import noServiceUrl from 'assets/images/no_service.png'

export default function NoService() {
  return (
    <Container maxWidth={'lg'} sx={{ marginTop: 80 }}>
      <Box display="grid" gap="40px" padding="48px 64px">
        <Typography fontSize={28} fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Image src={noServiceUrl} /> Service Not Available in Your Region
        </Typography>
        <Box width="100%" sx={{ fontSize: 20, color: theme => theme.palette.text.secondary }}>
          <p> Sorry! For compliance reasons, this service is not accessible in your area.</p>
          <p>
            The dapp is only open to non-U.S. and non-China persons and entities. Use of VPN, Tor, proxies or other
            means to circumvent this restriction is a violation of our&nbsp; Terms of Service.
          </p>
          <p>For details, please see our&nbsp; Terms of Service .</p>
        </Box>
      </Box>
    </Container>
  )
}
