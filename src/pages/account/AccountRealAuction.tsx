import { Box, Container, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import ComingSoon from 'pages/ComingSoon'

export default function AccountRealAuction() {
  return (
    <AccountLayout>
      <Box padding="40px 20px">
        <Container
          sx={{
            maxWidth: '1080px !important',
            position: 'relative'
          }}
        >
          <Typography variant="h3" fontSize={30}>
            My Real World Asset Auction
          </Typography>
          <ComingSoon
            sx={{
              padding: '40px 0'
            }}
          />
        </Container>
      </Box>
    </AccountLayout>
  )
}
