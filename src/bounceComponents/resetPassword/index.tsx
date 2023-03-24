import { Box, Button, InputAdornment, OutlinedInput, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import React, { useState } from 'react'
import { useCountDown, useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { show, useModal } from '@ebay/nice-modal-react'
import md5 from 'md5'
import { ReactComponent as CodeSendSVG } from 'bounceComponents/profile/account/CodeSend.svg'
import PasswordRestDialog from './PasswordRestDialog/PasswordRestDialog'
import FormItem from 'bounceComponents/common/FormItem'
import { changePassword, verifyCode } from 'api/user'
import { IChangePasswordParams } from 'api/user/type'
import MuiDialog from 'bounceComponents/common/Dialog'

// export type IResetPasswordProps = {}
const validationSchema = yup.object({
  email: yup.string().trim().required('Please enter your email address').email('Incorrect email address'),
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
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(8, 'Minimum 8 characters')
    .max(16, 'Maximum 16 characters'),
  confirmPassword: yup
    .string()
    .when('password', (password, schema) => {
      return schema.test('verify consistency', 'Please enter the same password', (value: any) => value === password)
    })
    .required('Please enter your password')
})
const ResetPassword: React.FC = () => {
  const modal = useModal()
  const [showCountDown, setShowCountDown] = useState<number>()
  const [btnDisable, setBtnDisable] = useState<boolean>(true)
  const [countdown] = useCountDown({
    targetDate: showCountDown,
    onEnd: () => {
      setShowCountDown(undefined)
    }
  })
  const initialValues = {
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  }
  const { run: sendVerifyCode } = useRequest(async email => verifyCode({ email: email }), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code !== 200) {
        return toast.error('Incorrect verification code')
      } else {
        setBtnDisable(false)
        return toast.success('Send successfully')
      }
    }
  })
  const { run: handleChangePassword, loading } = useRequest(
    async (params: IChangePasswordParams) => changePassword(params),
    {
      manual: true,
      onSuccess: response => {
        const { code } = response
        if (code === 200) {
          toast.success('Password successfully reset.')
          return show(MuiDialog, { children: <PasswordRestDialog /> })
        } else if (code === 10501) {
          return toast.error('Incorrect verification code')
        } else if (code === 10500) {
          return toast.error('Please wait one minute and try again')
        }
        return ''
      }
    }
  )
  const handleSubmit = (values: typeof initialValues) => {
    handleChangePassword({ email: values.email, password: md5(values.confirmPassword), verifyCode: values.code })
  }
  return (
    <Stack spacing={32} component={Box}>
      <Typography variant="body1" color={'var(--ps-gray-700)'}>
        To have your password reset, enter your email address below. Enter the right verification code to reset your
        password.
      </Typography>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {values => (
          <Stack component={Form} spacing={20}>
            <FormItem name="email" label="Email" required>
              <OutlinedInput />
            </FormItem>
            <FormItem required name="code" label="Email verification code">
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    {countdown === 0 ? (
                      <Box
                        sx={{ display: 'flex', cursor: 'pointer' }}
                        onClick={() => {
                          if (values.values.email) {
                            sendVerifyCode(values.values.email)
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
            <FormItem name="password" required label="New password (minimum 8 characters)">
              <OutlinedInput type="password" />
            </FormItem>
            <FormItem required name="confirmPassword" label="Confirm the password">
              <OutlinedInput type="password" />
            </FormItem>
            <Box style={{ marginLeft: 'auto', marginTop: '32px' }}>
              <Button variant="outlined" sx={{ width: 120, height: 60 }} onClick={() => modal.hide()}>
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                type="submit"
                disabled={btnDisable}
                variant="contained"
                sx={{ ml: 10, width: 120, height: 60 }}
              >
                Next
              </LoadingButton>
            </Box>
          </Stack>
        )}
      </Formik>
    </Stack>
  )
}

export default ResetPassword
