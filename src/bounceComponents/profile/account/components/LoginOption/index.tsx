import { Stack } from '@mui/system'
import React from 'react'
import SettingsBox from '../../SettingsBox'
// import { ReactComponent as LinkedInSVG } from '../../../../signup/assets/linkedIn.svg'
import { ReactComponent as TwitterSVG } from '../../../../signup/assets/twitter.svg'
import { ReactComponent as GoogleSVG } from './BoxLayout/googleLog.svg'
import BoxLayout from './BoxLayout/BoxLayout'
import { ACCOUNT_TYPE } from 'api/user/type'
import { useBindThirdPart } from 'bounceHooks/user/useBindThirdPart'
import { useOauth } from 'state/users/hooks'
export type ILoginOptonProps = {
  googleEmail: string
  twitter: string
}

const LoginOpton: React.FC<ILoginOptonProps> = ({ googleEmail, twitter }) => {
  const { handleOauth } = useOauth()
  const { run } = useBindThirdPart()
  const handleThirdBind = async (oauthName: string, oauthType: ACCOUNT_TYPE) => {
    const accessToken = await handleOauth(oauthName)
    run({
      accessToken: accessToken,
      thirdpartType: oauthType
    })
  }
  // const { linkedInLogin } = useLinkedInOauth((accessToken, oauthType) =>
  //   run({
  //     accessToken: accessToken,
  //     thirdpartType: oauthType
  //   })
  // )
  // const handleThirdLinkedinOauth = async () => {
  //   linkedInLogin()
  // }

  return (
    <SettingsBox title="Other Login Options">
      <Stack spacing={20} mt={20} mb={40}>
        <BoxLayout
          email={googleEmail}
          title={'Google account'}
          emailSvg={<GoogleSVG />}
          onBind={() => handleThirdBind('google', ACCOUNT_TYPE.GMAIL)}
        />
        <BoxLayout
          email={twitter}
          title={'Twitter account'}
          emailSvg={<TwitterSVG />}
          onBind={() => handleThirdBind('twitter', ACCOUNT_TYPE.TWITTER)}
        />
      </Stack>
    </SettingsBox>
  )
}

export default LoginOpton
