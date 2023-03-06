import { Container, Divider } from '@mui/material'
import React from 'react'
import EditInfo from 'bounceComponents/profile/account/components/EditInfo'
import LoginOpton from 'bounceComponents/profile/account/components/LoginOption'
import EVMWallet from 'bounceComponents/profile/account/components/EVMWallet'
import { USER_TYPE } from 'api/user/type'
import { useUserInfo } from 'state/users/hooks'

// export type IAccountSettingsProps = {}

const AccountSettings: React.FC = ({}) => {
  const { userType, userInfo, companyInfo } = useUserInfo()

  const tempInfo = Number(userType) === USER_TYPE.USER ? userInfo : companyInfo
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 40 }}>
        <Container maxWidth="md" sx={{ mt: 24, background: '#FFFFFF', borderRadius: 20 }}>
          <EditInfo userInfoEmail={tempInfo?.email} />
          <Divider sx={{ opacity: 0.1 }} />
          <LoginOpton
            googleEmail={tempInfo?.googleEmail}
            twitter={tempInfo?.twitterName}
            linkedin={tempInfo?.linkedinName}
          />
          <Divider sx={{ opacity: 0.1 }} />
          <EVMWallet />
          {/* <Purchase /> */}
        </Container>
      </Container>
    </>
  )
}

export default AccountSettings
