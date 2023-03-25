import React, { useState } from 'react'
import * as yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import md5 from 'md5'
import { ReactComponent as VisibilityOn } from 'assets/imgs/user/visibility_on.svg'
import { ReactComponent as VisibilityOff } from 'assets/imgs/user/visibility_off.svg'
import FormItem from 'bounceComponents/common/FormItem'

import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { ACCOUNT_TYPE, USER_TYPE } from 'api/user/type'
import { useRegister } from 'bounceHooks/user/useRegister'
import { ThirdParties } from 'bounceComponents/signup/ThirdParties'
import { checkEmail, verifyCode } from 'api/user'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { stringify } from 'querystring'
import { useCountDown, useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { ReactComponent as CodeSendSVG } from 'bounceComponents/profile/account/CodeSend.svg'
import { isEmail } from 'utils'

// export type IAccountProps = {}
const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Please enter your email address')
    .email('Incorrect email address')
    .test('CHECK_EMAIL', 'This email is registered', async value => {
      const { code, data } = await checkEmail({ email: value || '' })
      if (code === 200 && data?.exist) {
        return false
      }
      return true
    }),
  code: yup
    .string()
    .trim()
    .required('Please enter your verification code')
    .test('CODE', 'Incorrect verification code', function (val) {
      if (val && /^[0-9]{6}$/.test(val)) {
        return true
      }
      return false
    }),
  name: yup
    .string()
    .trim()
    .required('Please enter your full name')
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect full name')
    .max(300, 'Full name should contain 1-300 characters'),
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(8, 'Password should contain 8-16 characters')
    .max(16, 'Password should contain 8-16 characters')
})

const Account: React.FC = ({}) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [btnDisable, setBtnDisable] = useState<boolean>(true)
  const [showCountDown, setShowCountDown] = useState<number>()
  const [countdown] = useCountDown({
    targetDate: showCountDown,
    onEnd: () => {
      setShowCountDown(undefined)
    }
  })
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const initialValues = {
    password: '',
    name: '',
    email: '',
    code: ''
  }
  const { loading, runAsync: runRegister } = useRegister()
  const handleSubmit = (values: typeof initialValues) => {
    runRegister({
      password: md5(values.password.trim()),
      name: values.name.trim(),
      email: values.email.trim(),
      accessToken: '',
      registerType: ACCOUNT_TYPE.EMAIL,
      userType: USER_TYPE.USER,
      verifyCode: values.code
    })
  }

  const { run: sendVerifyCode } = useRequest(async email => verifyCode({ email: email, codeType: 1 }), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code !== 200) {
        setShowCountDown(undefined)
        return toast.error('Incorrect verification code')
      } else {
        setBtnDisable(false)
        return toast.success('Send successfully')
      }
    }
  })

  const handleOauth = (accessToken: string, oauthType: ACCOUNT_TYPE) => {
    navigate(routes.signup.thirdPartiesAccount + '?' + stringify({ accessToken, oauthType }))
  }
  return (
    <LoginLayout title={'Create Account'} subTitle={<Link to={routes.login}>Sign in</Link>}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ values }) => (
          <Box component={Form} noValidate>
            <FormItem name="email" label="Email" required>
              <OutlinedInput />
            </FormItem>
            <FormItem name="name" label="Full name" sx={{ mt: 20 }} required>
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
            <FormItem required name="code" sx={{ mt: 20 }} label="Email verification code">
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    {countdown === 0 ? (
                      <Box
                        sx={{ display: 'flex', cursor: 'pointer' }}
                        onClick={() => {
                          if (isEmail(values.email)) {
                            sendVerifyCode(values.email)
                            setShowCountDown(Date.now() + 60000)
                          }
                        }}
                      >
                        <Typography variant="body1" color={'#2663FF'} mr={6}>
                          Send
                        </Typography>
                        <CodeSendSVG />
                      </Box>
                    ) : (
                      <Typography variant="body1" color={'var(--ps-gray-900)'}>
                        {Math.round(countdown / 1000)}s
                      </Typography>
                    )}
                  </InputAdornment>
                }
              />
            </FormItem>
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              disabled={btnDisable}
              variant="contained"
              sx={{ mt: 32, mb: 32 }}
            >
              Continue
            </LoadingButton>
          </Box>
        )}
      </Formik>
      <ThirdParties text="or sign up with" onChange={handleOauth} />
    </LoginLayout>
  )
}

export default Account
