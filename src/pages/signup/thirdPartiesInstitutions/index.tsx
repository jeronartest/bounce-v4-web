import React from 'react'
import * as yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, OutlinedInput } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import FormItem from 'bounceComponents/common/FormItem'

import LoginLayout from 'bounceComponents/signup/LoginLayout'
import { USER_TYPE } from 'api/user/type'
import { useRegister } from 'bounceHooks/user/useRegister'
import { checkEmail } from 'api/user'
import { useQueryParams } from 'hooks/useQueryParams'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routes'

// export type IThirdPartiesInstitutions = {}
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
    .max(300, 'Company name should contain 1-300 characters')
})

const ThirdPartiesInstitutions: React.FC = ({}) => {
  const { accessToken, oauthType } = useQueryParams()
  const initialValues = {
    email: '',
    name: ''
  }
  const { loading, runAsync: runRegister } = useRegister()
  const handleSubmit = (values: typeof initialValues) => {
    runRegister({
      email: values.email.trim(),
      name: values.name.trim(),
      accessToken: accessToken?.toString() || '',
      password: '',
      registerType: Number(oauthType),
      userType: USER_TYPE.INVESTOR
    })
  }

  return (
    <LoginLayout title={'Create Institutional Investor Account'} subTitle={<Link to={routes.login}>Sign in</Link>}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {() => (
          <Box component={Form} noValidate>
            <FormItem name="email" label="Email" required>
              <OutlinedInput />
            </FormItem>
            <FormItem name="name" label="Company name" sx={{ mt: 20 }} required>
              <OutlinedInput />
            </FormItem>
            <LoadingButton loading={loading} type="submit" fullWidth variant="contained" sx={{ my: 32 }}>
              Continue
            </LoadingButton>
          </Box>
        )}
      </Formik>
    </LoginLayout>
  )
}

export default ThirdPartiesInstitutions
