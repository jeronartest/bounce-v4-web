import React, { useState } from 'react'
import * as yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import md5 from 'md5'
import { ReactComponent as VisibilityOn } from 'assets/imgs/user/visibility_on.svg'
import { ReactComponent as VisibilityOff } from 'assets/imgs/user/visibility_off.svg'
import FormItem from 'bounceComponents/common/FormItem'
import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { useRegister } from 'bounceHooks/user/useRegister'
import { ThirdParties } from 'bounceComponents/signup/ThirdParties'
import { ACCOUNT_TYPE, USER_TYPE } from 'api/user/type'
import { checkEmail } from 'api/user'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { stringify } from 'querystring'
// export type ICompanyProps = {}
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
  name: yup
    .string()
    .trim()
    .required('Please enter your company name')
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect company name')
    .max(300, 'Company name should contain 1-300 characters'),
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(8, 'Password should contain 8-16 characters')
    .max(16, 'Password should contain 8-16 characters')
})

const Company: React.FC = ({}) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const initialValues = {
    password: '',
    name: '',
    email: ''
  }

  const { loading, runAsync: runRegister } = useRegister()
  const handleSubmit = (values: typeof initialValues) => {
    runRegister({
      password: md5(values.password.trim()),
      name: values.name.trim(),
      email: values.email.trim(),
      accessToken: '',
      registerType: ACCOUNT_TYPE.EMAIL,
      userType: USER_TYPE.COMPANY
    })
  }
  const handleOauth = (accessToken: string, oauthType: ACCOUNT_TYPE) => {
    navigate(routes.signup.thirdPartiesCompany + '?' + stringify({ accessToken, oauthType }))
  }
  return (
    <LoginLayout title={'Create Company Account'} subTitle={<Link to={routes.login}>Sign in</Link>}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {() => (
          <Box component={Form}>
            <FormItem name="email" label="Email" required>
              <OutlinedInput />
            </FormItem>
            <FormItem name="name" label="Company name" sx={{ mt: 20 }} required>
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
            <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ mt: 32, mb: 32 }}>
              Continue
            </LoadingButton>
          </Box>
        )}
      </Formik>
      <ThirdParties text="or sign up with" onChange={handleOauth} />
    </LoginLayout>
  )
}

export default Company
