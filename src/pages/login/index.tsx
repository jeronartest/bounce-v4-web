import React, { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'
import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { useUserInfo, useWeb3Login } from 'state/users/hooks'
import { useQueryParams } from 'hooks/useQueryParams'
import { useActiveWeb3React } from 'hooks'
import { Button } from '@mui/material'
import { useWalletModalToggle } from 'state/application/hooks'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const Login: React.FC = () => {
  const params = useQueryParams()
  const { path } = params
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { token } = useUserInfo()
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      toast.success('You have logged in')
      navigate(routes.market.index)
    }
  }, [navigate, token])

  const { run: runLogin, loading } = useWeb3Login(path?.toString())

  return (
    <section>
      <LoginLayout title={'Login'} subTitle={<></>}>
        {account ? (
          <LoadingButton sx={{ width: 300 }} loadingPosition="start" loading={loading} onClick={runLogin}>
            Use wallet signature for login
          </LoadingButton>
        ) : (
          <Button sx={{ width: 200 }} onClick={toggleWalletModal}>
            Connect Wallet
          </Button>
        )}
      </LoginLayout>
    </section>
  )
}

export default Login
