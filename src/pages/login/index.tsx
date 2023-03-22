import React, { useState } from 'react'
import * as yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'

import { LoadingButton } from '@mui/lab'
import { show } from '@ebay/nice-modal-react'
import md5 from 'md5'
import { ACCOUNT_TYPE } from 'api/user/type'
import MuiDialog from 'bounceComponents/common/Dialog'

import FormItem from 'bounceComponents/common/FormItem'
import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { useLogin } from 'state/users/hooks'
import ResetPassword from 'bounceComponents/resetPassword'
import { ThirdParties } from 'bounceComponents/signup/ThirdParties'
import { ReactComponent as VisibilityOn } from 'assets/imgs/user/visibility_on.svg'
import { ReactComponent as VisibilityOff } from 'assets/imgs/user/visibility_off.svg'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useQueryParams } from 'hooks/useQueryParams'

const validationSchema = yup.object({
  email: yup.string().trim().required('Email is required').email('email error.'),
  password: yup
    .string()
    .trim()
    .required('Password is required')
    .min(8, 'minimum 8 characters')
    .max(16, 'maximum 16 characters')
})

const Login: React.FC = () => {
  const params = useQueryParams()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { path } = params
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const initialValues = {
    password: '',
    email: ''
  }

  const { run: runLogin, loading } = useLogin(path?.toString())

  const handleSubmit = (values: typeof initialValues) => {
    runLogin({
      accessToken: '',
      email: values.email.trim(),
      password: md5(values.password.trim()),
      loginType: ACCOUNT_TYPE.EMAIL
    })
  }
  const showModal = () => {
    show(MuiDialog, { title: 'Reset Passward', fullWidth: true, children: <ResetPassword /> })
  }
  const handleOauth = (accessToken: string, oauthType: ACCOUNT_TYPE) => {
    runLogin({
      accessToken: accessToken,
      email: '',
      password: '',
      loginType: oauthType
    })
  }
  return (
    <section>
      <LoginLayout title={'Login'} subTitle={<Link to={routes.signup.account}>Sign up</Link>}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {() => (
            <Box component={Form}>
              <FormItem name="email" label="Email" required>
                <OutlinedInput />
              </FormItem>
              <FormItem name="password" label="Password" sx={{ mt: 20 }} required>
                <OutlinedInput
                  autoComplete="off"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOn /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormItem>
              <Typography
                onClick={showModal}
                sx={{ cursor: 'pointer' }}
                variant="body2"
                color="#2663FF"
                textAlign="justify"
                lineHeight="15px"
                mt={12}
              >
                Forget password?
              </Typography>
              <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 32, mb: 32 }}>
                Log In
              </LoadingButton>
            </Box>
          )}
        </Formik>
        <ThirdParties text="or log in with" onChange={handleOauth} />
      </LoginLayout>
    </section>
  )
}

export default Login
