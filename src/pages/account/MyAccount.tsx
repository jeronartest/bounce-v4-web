import { Box, Container, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import NoData from 'bounceComponents/common/NoData'
import EditInfo from 'bounceComponents/profile/account/components/EditInfo'
import LoginOpton from 'bounceComponents/profile/account/components/LoginOption'
import { useUserInfo } from 'state/users/hooks'
import { Dots } from 'themes'

export default function MyAccount() {
  const { userInfo } = useUserInfo()

  const tempInfo = { ...userInfo }

  return (
    <AccountLayout>
      <Box padding="40px 20px 80px">
        <Container
          sx={{
            maxWidth: '860px !important'
          }}
        >
          <Typography mb={40} variant="h3" fontSize={30}>
            My Account
          </Typography>
          <Box
            sx={{
              padding: '48px 100px 60px',
              background: '#F5F5F5',
              borderRadius: '20px'
            }}
          >
            <EditInfo userInfoEmail={tempInfo?.email} />
            <LoginOpton
              googleEmail={tempInfo?.googleEmail}
              twitter={tempInfo?.twitterName}
              linkedin={tempInfo?.linkedinName}
            />
            <Box>
              <Typography variant="h3" fontSize={16}>
                Account Abstraction Wallet
              </Typography>
              <NoData
                sx={{
                  '& svg': {
                    height: 'auto',
                    maxHeight: 'auto'
                  },
                  color: '#D1D4D8'
                }}
              >
                <>
                  Coming soon
                  <Dots />
                </>
              </NoData>
            </Box>
          </Box>
        </Container>
      </Box>
    </AccountLayout>
  )
}
