import { Box, Container, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import ProfileOverview from 'bounceComponents/account/ProfileOverview'

export default function MyProfile() {
  return (
    <AccountLayout>
      <Box padding="40px 20px">
        <Container
          sx={{
            maxWidth: '860px !important',
            position: 'relative'
          }}
        >
          <Typography variant="h3" fontSize={30}>
            My Profile
          </Typography>
          <Box
            sx={{
              mt: 40,
              padding: '48px 100px',
              background: '#F5F5F5',
              borderRadius: '20px'
            }}
          >
            <ProfileOverview />
          </Box>
        </Container>
      </Box>
    </AccountLayout>
  )
}
