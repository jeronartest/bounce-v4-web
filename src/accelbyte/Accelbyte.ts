// Entry.tsx

import { SdkWidget } from '@accelbyte/widgets'
import { App } from './App'
import '@accelbyte/widgets/dist/style.css'
import './GlobalStyle.scss'

const SDK_CONFIG = {
  baseURL: process.env.ACCELBYTE_BASE_URL,
  clientId: process.env.ACCELBYTE_CLIENT_ID,
  namespace: process.env.ACCELBYTE_NAMESPACE,
  redirectURI: process.env.ACCELBTE_REDIRECT_URI,
}

ReactDOM.render(
  <SdkWidget sdkOptions={SDK_CONFIG}>
    <App />
  </SdkWidget>,
  document.getElementById('root')
)

// ----------------------------------------------------------------------------------------------------------
// App.tsx

import { LoginWidget } from '@accelbyte/widgets'
import './CustomStyle.scss'

export default function Accelbyte {
  return (
    
      <LoginWidget onLogout={() => this.props.history.push('/')} />
    
  )
}

export default withRouter(App)





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