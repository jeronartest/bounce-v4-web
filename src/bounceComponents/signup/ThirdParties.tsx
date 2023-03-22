import React from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { ReactComponent as GoogleSVG } from './assets/google.svg'
import { ReactComponent as TwitterSVG } from './assets/twitter.svg'
// import { ReactComponent as LinkedInSVG } from './assets/linkedIn.svg'
import { ACCOUNT_TYPE } from 'api/user/type'
import { useOauth } from 'state/users/hooks'

export type IThirdPartiesProps = {
  text: string
  onChange: (accessToken: string, oauthType: ACCOUNT_TYPE) => void
}
export const ThirdParties: React.FC<IThirdPartiesProps> = ({ text, onChange }) => {
  // const { linkedInLogin } = useLinkedInOauth(onChange)
  const { handleOauth } = useOauth()
  const handleThirdOauth = async (oauthName: string, oauthType: ACCOUNT_TYPE) => {
    const accessToken = await handleOauth(oauthName)
    onChange?.(accessToken, oauthType)
  }
  // const handleThirdLinkedinOauth = async () => {
  //   linkedInLogin()
  // }
  return (
    <Box sx={{ m: '0 auto', width: 428 }}>
      <Divider
        sx={{
          mb: 32,
          color: '#C8CBCE',
          '&:before,:after': {
            borderColor: '#C8CBCE'
          },
          '& .MuiDivider-wrapper': {
            padding: '0 8px'
          }
        }}
      >
        {text}
      </Divider>
      <Stack direction={'row'} spacing={10} justifyContent="center">
        <Button
          variant="text"
          startIcon={<GoogleSVG />}
          sx={{ background: '#F5F5F5', width: '136px' }}
          onClick={() => handleThirdOauth('google', ACCOUNT_TYPE.GMAIL)}
        >
          <Typography variant="body1" color={'#000000'}>
            Google
          </Typography>
        </Button>
        <Button
          variant="text"
          startIcon={<TwitterSVG />}
          sx={{ background: '#F5F5F5', width: '136px' }}
          onClick={() => handleThirdOauth('twitter', ACCOUNT_TYPE.TWITTER)}
        >
          <Typography variant="body1" color={'#000000'}>
            Twitter
          </Typography>
        </Button>
        {/* <Button
          variant="text"
          startIcon={<LinkedInSVG />}
          sx={{ background: '#F5F5F5', width: '136px' }}
          onClick={() => handleThirdLinkedinOauth()}
        >
          <Typography variant="body1" color={'#000000'}>
            LinkedIn
          </Typography>
        </Button> */}
      </Stack>
    </Box>
  )
}
