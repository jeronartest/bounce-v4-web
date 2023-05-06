import { Stack } from '@mui/system'
import React from 'react'
// import { ReactComponent as LinkedInSVG } from '../../../../signup/assets/linkedIn.svg'
import { ReactComponent as TwitterSVG } from '../../../../signup/assets/twitter.svg'
// import { ReactComponent as GoogleSVG } from './BoxLayout/googleLog.svg'
import BoxLayout from './BoxLayout/BoxLayout'
import { ACCOUNT_TYPE } from 'api/user/type'
import { useBindThirdPart } from 'bounceHooks/user/useBindThirdPart'
import { useOauth } from 'state/users/hooks'
export type ILoginOptonProps = {
  // googleEmail: string
  twitter: string
}

const LoginOpton: React.FC<ILoginOptonProps> = ({ twitter }) => {
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
    <Stack>
      {/* <BoxLayout
          email={googleEmail}
          title={'Google account'}
          emailSvg={<GoogleSVG />}
          onBind={() => handleThirdBind('google', ACCOUNT_TYPE.GMAIL)}
        /> */}
      <BoxLayout
        link={twitter}
        title={'Twitter'}
        image={<TwitterSVG />}
        onBind={() => handleThirdBind('twitter', ACCOUNT_TYPE.TWITTER)}
      />
    </Stack>
  )
}

export default LoginOpton
