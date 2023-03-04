import { Button, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useCountDown, useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import md5 from 'md5'
import { ReactComponent as CodeSendSVG } from '../../CodeSend.svg'
import { ReactComponent as EditPwSvg } from './editPw.svg'
import FormItem from '@/components/common/FormItem'
import { changePassword, verifyCode } from '@/api/user'
import { IChangePasswordParams } from '@/api/user/type'
import { useLogout } from '@/hooks/user/useLogin'
import { ReactComponent as CloseSvg } from '@/assets/imgs/close.svg'

export type IEditInfoProps = {
  userInfoEmail: string
}

const validationSchema = yup.object({
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(8, 'Password should contain 8-16 characters')
    .max(16, 'Password should contain 8-16 characters'),
  code: yup
    .string()
    .trim()
    .required('Please enter your email verification code')
    .length(6, 'Email verification code should contain 6 characters'),
})
const EditInfo: React.FC<IEditInfoProps> = ({ userInfoEmail }) => {
  const [editBool, setEditBool] = useState<boolean>(false)
  const [btnDisable, setBtnDisable] = useState<boolean>(true)
  const [showCountDown, setShowCountDown] = useState<number>()
  const [countdown] = useCountDown({
    targetDate: showCountDown,
    onEnd: () => {
      setShowCountDown(undefined)
    },
  })

  const initialValues = {
    password: '',
    email: userInfoEmail,
    code: '',
  }
  const { logout } = useLogout()
  const { run: handleChangePassword, loading } = useRequest(
    async (params: IChangePasswordParams) => changePassword(params),
    {
      manual: true,
      onSuccess: (response) => {
        const { code } = response
        if (code === 200) {
          toast.success('Password successfully reset.')
          logout()
        } else if (code === 10501) {
          return toast.error('Incorrect verification code')
        } else if (code === 10500) {
          return toast.error('Please wait one minute and try again')
        } else {
          return toast.error('Please try again')
        }
      },
    },
  )

  const handleSubmit = (values: typeof initialValues) => {
    handleChangePassword({ email: values.email, password: md5(values.password), verifyCode: values.code })
  }

  const { run: sendVerifyCode } = useRequest(async () => verifyCode({ email: userInfoEmail }), {
    manual: true,
    onSuccess: (response) => {
      const { code } = response
      if (code !== 200) {
        return toast.error('Please wait one minute and try again')
      } else {
        setBtnDisable(false)
        return toast.success('Send successfully')
      }
    },
  })
  return (
    <Box>
      <Box sx={{ textAlign: 'end', p: 20 }}>
        <IconButton
          sx={{ p: 0 }}
          onClick={() => {
            history.back()
          }}
        >
          <CloseSvg />
        </IconButton>
      </Box>
      <Box px={100}>
        <Typography variant="h2">Account Settings</Typography>
        {editBool ? (
          <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {(values) => (
              <Box>
                <Typography variant="h4" mt={40} mb={20}>
                  Email
                </Typography>
                <Stack component={Form} spacing={20} mb={40}>
                  <FormItem name="email" required label="Email">
                    <OutlinedInput disabled />
                  </FormItem>
                  <FormItem name="password" required label="New password" tips={'contains 8-16 characters'}>
                    <OutlinedInput type="password" />
                  </FormItem>
                  <FormItem name="code" required label="Email verification code">
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position="end">
                          {countdown === 0 ? (
                            <Box
                              sx={{ display: 'flex', cursor: 'pointer' }}
                              onClick={() => {
                                if (values.values.email) {
                                  sendVerifyCode()
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
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditBool(false)
                      }}
                      sx={{ width: 120, height: 60 }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      disabled={btnDisable}
                      variant="contained"
                      sx={{ ml: 10, width: 120, height: 60 }}
                    >
                      Apply
                    </LoadingButton>
                  </Box>
                </Stack>
              </Box>
            )}
          </Formik>
        ) : (
          <Stack pt={40} spacing={20} pb={40}>
            <Typography variant="h4">Email</Typography>
            <Box sx={{ border: '1px solid #D7D6D9', borderRadius: 20, p: '12px 20px' }}>
              <Typography variant="body2" color={'var(--ps-gray-700)'}>
                Email
              </Typography>
              <Typography variant="body1" color={'var(--ps-gray-900)'}>
                {userInfoEmail}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'flex-start'}>
              <Typography variant="body1" color={'var(--ps-gray-900)'}>
                Edit password
              </Typography>
              <Box
                ml={10}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setEditBool(true)
                }}
              >
                <EditPwSvg />
              </Box>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default EditInfo
