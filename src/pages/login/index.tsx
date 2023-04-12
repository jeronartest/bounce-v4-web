import React from 'react'
import { LoadingButton } from '@mui/lab'
import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { useWeb3Login } from 'state/users/hooks'
import { useQueryParams } from 'hooks/useQueryParams'

const Login: React.FC = () => {
  const params = useQueryParams()
  const { path } = params

  const { run: runLogin, loading } = useWeb3Login(path?.toString())

  return (
    <section>
      <LoginLayout title={'Login'} subTitle={<></>}>
        <LoadingButton sx={{ width: 200 }} loadingPosition="start" loading={loading} onClick={runLogin}>
          Register Or Login
        </LoadingButton>
      </LoginLayout>
    </section>
  )
}

export default Login
