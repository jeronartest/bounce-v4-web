import { Box, Container, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import ProfileOverview from 'bounceComponents/account/ProfileOverview'

export default function MyProfile() {
  return (
    <AccountLayout>
      <Box>
        <Container
          sx={{
            maxWidth: '860px !important'
          }}
        >
          <Box padding="40px 60px" position={'relative'}>
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
          </Box>
        </Container>
      </Box>
    </AccountLayout>
  )
}
