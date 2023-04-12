import { Button, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { useCountDown, useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { ReactComponent as CodeSendSVG } from '../../CodeSend.svg'
import { ReactComponent as EditPwSvg } from './editPw.svg'
import FormItem from 'bounceComponents/common/FormItem'
import { changeEmail, verifyCode } from 'api/user'
import { IChangeEmailParams } from 'api/user/type'
import { isEmail } from 'utils'
import { fetchUserInfo } from 'state/users/reducer'
import { useDispatch } from 'react-redux'

export type IEditInfoProps = {
  userInfoEmail: string
  userId?: number | string
}

const EditInfo: React.FC<IEditInfoProps> = ({ userInfoEmail, userId }) => {
  const [editBool, setEditBool] = useState<boolean>(false)
  const [btnDisable, setBtnDisable] = useState<boolean>(true)
  const [showCountDown, setShowCountDown] = useState<number>()
  const dispatch = useDispatch()
  const [countdown] = useCountDown({
    targetDate: showCountDown,
    onEnd: () => {
      setShowCountDown(undefined)
    }
  })

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required('Please enter your email address')
      .email('Incorrect email address')
      .test('CHECK_EMAIL', 'Email must be inconsistent', val => {
        return val !== userInfoEmail
      }),
    code: yup
      .string()
      .trim()
      .required('Please enter your email verification code')
      .length(6, 'Email verification code should contain 6 characters')
  })

  const initialValues = {
    email: userInfoEmail,
    code: ''
  }
  const { run: handleChangeEmail, loading } = useRequest(async (params: IChangeEmailParams) => changeEmail(params), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code === 200) {
        toast.success('Password successfully reset.')
        dispatch(
          fetchUserInfo({
            userId
          })
        )
        setEditBool(false)
      } else if (code === 10501) {
        return toast.error('Incorrect verification code')
      } else if (code === 10400) {
        return toast.error('The email is already in use')
      } else if (code === 10500) {
        return toast.error('Please wait one minute and try again')
      } else {
        return toast.error('Please try again')
      }
      return
    }
  })

  const handleSubmit = (values: typeof initialValues) => {
    handleChangeEmail({ email: values.email, verifyCode: values.code })
  }

  const { run: sendVerifyCode } = useRequest(async (email: string) => verifyCode({ email, codeType: 1 }), {
    manual: true,
    onSuccess: response => {
      const { code } = response
      if (code !== 200) {
        return toast.error('Please wait one minute and try again')
      } else {
        setBtnDisable(false)
        return toast.success('Send successfully')
      }
    }
  })
  return (
    <Box>
      {editBool ? (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {values => (
            <Box>
              <Typography variant="h4" mt={40} mb={20}>
                Email
              </Typography>
              <Stack component={Form} spacing={20} mb={40}>
                <FormItem name="email" required label="Email">
                  <OutlinedInput />
                </FormItem>
                <FormItem name="code" required label="Email verification code">
                  <OutlinedInput
                    endAdornment={
                      <InputAdornment position="end">
                        {countdown === 0 ? (
                          <Box
                            sx={{ display: 'flex', cursor: 'pointer' }}
                            onClick={() => {
                              if (
                                values.values.email &&
                                isEmail(values.values.email) &&
                                values.values.email !== userInfoEmail
                              ) {
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
        <Stack pt={40} spacing={20}>
          <Typography variant="h4">Email</Typography>
          <Box sx={{ border: '1px solid #D7D6D9', backgroundColor: '#fff', borderRadius: 20, p: '12px 20px' }}>
            <Typography variant="body2" color={'var(--ps-gray-700)'}>
              Email
            </Typography>
            <Typography variant="body1" color={'var(--ps-gray-900)'}>
              {userInfoEmail || '-'}
            </Typography>
          </Box>
          <Box
            display={'flex'}
            alignItems={'flex-start'}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setEditBool(true)
            }}
          >
            <Typography variant="body1" color={'var(--ps-gray-900)'}>
              Edit email
            </Typography>
            <Box ml={10}>
              <EditPwSvg />
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default EditInfo
