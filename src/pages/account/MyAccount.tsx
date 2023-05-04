import { Box, Container, Stack, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import NoData from 'bounceComponents/common/NoData'
import EditInfo from 'bounceComponents/profile/account/components/EditInfo'
import LoginOpton from 'bounceComponents/profile/account/components/LoginOption'
import ComingSoon from 'pages/ComingSoon'
import { useState } from 'react'
import { useUserInfo } from 'state/users/hooks'
import { Dots } from 'themes'
import styles from './tabStyles'

enum TabListProp {
  'Account_Settings' = 'Account Settings',
  'KYC_Credentials' = 'KYC & Credentials'
}

const tabsList = [TabListProp.Account_Settings, TabListProp.KYC_Credentials]

export default function MyAccount() {
  const { userInfo, userId } = useUserInfo()
  const [curTab, setCurTab] = useState(TabListProp.Account_Settings)

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
          <Stack direction={'row'} justifyContent="space-between" sx={{ ...styles.tabsBox, padding: 0 }}>
            <Stack direction="row" spacing={36} alignItems="center">
              {tabsList?.map(item => {
                return (
                  <Typography
                    variant="h4"
                    onClick={() => setCurTab(item)}
                    key={item}
                    sx={{ ...styles.menu, ...(curTab === item ? styles.menuActive : ({} as any)) }}
                  >
                    {item}
                  </Typography>
                )
              })}
            </Stack>
          </Stack>
          {curTab === TabListProp.Account_Settings && (
            <Box
              sx={{
                mt: 40,
                padding: '48px 100px 60px',
                background: '#F5F5F5',
                borderRadius: '20px'
              }}
            >
              <EditInfo userInfoEmail={userInfo?.email} userId={userId} />
              <LoginOpton googleEmail={userInfo?.googleEmail} twitter={userInfo?.twitterName} />
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
          )}

          {curTab === TabListProp.KYC_Credentials && (
            <ComingSoon
              sx={{
                padding: '40px 0px'
              }}
            />
          )}
        </Container>
      </Box>
    </AccountLayout>
  )
}
