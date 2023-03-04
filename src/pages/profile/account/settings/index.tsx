import { Container, Divider } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import EditInfo from '@/components/profile/account/components/EditInfo'
import { RootState } from '@/store'
import LoginOpton from '@/components/profile/account/components/LoginOption'
import EVMWallet from '@/components/profile/account/components/EVMWallet'
import { USER_TYPE } from '@/api/user/type'
import useEagerConnect from '@/hooks/web3/useEagerConnect'

export type IAccountSettingsProps = {}

const AccountSettings: React.FC<IAccountSettingsProps> = ({}) => {
  useEagerConnect()

  const { userType, userInfo, companyInfo } = useSelector((state: RootState) => state.user)

  const tempInfo = Number(userType) === USER_TYPE.USER ? userInfo : companyInfo
  return (
    <>
      <Head>
        <title>Account Setting | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
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
