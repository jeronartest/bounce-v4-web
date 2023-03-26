import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Radio,
  Stack,
  Typography
} from '@mui/material'
import { useDispatch } from 'react-redux'
import Image from 'components/Image'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import md5 from 'md5'
import { show } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import PaperBox from 'bounceComponents/signup/PaperBox'
import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
import FormItem from 'bounceComponents/common/FormItem'
import VerifySuccessSVG from 'assets/imgs/verify/verifySuccess.svg'
import LinkedInSVG from 'assets/imgs/verify/linkedIn.svg'
import TwitterSVG from 'assets/imgs/verify/twitter.svg'
import { ReactComponent as CheckRadioSVG } from 'assets/imgs/verify/checkRadio.svg'
import { ReactComponent as UnCheckRadioSVG } from 'assets/imgs/verify/unCheckRadio.svg'
import { useClaimCheck, useGetUserUnverify, useVerifyAccount } from 'bounceHooks/user/useVerify'
import { USER_TYPE } from 'api/user/type'
import { ReactComponent as VisibilityOn } from 'assets/imgs/user/visibility_on.svg'
import { ReactComponent as VisibilityOff } from 'assets/imgs/user/visibility_off.svg'
import { useLinkedInOauth, useOauth } from 'state/users/hooks'
import DialogTips from 'bounceComponents/common/DialogTips'
import { fetchCompanyInfo, fetchUserInfo, saveLoginInfo } from 'state/users/reducer'
import { checkEmail } from 'api/user'
import { useNavigate } from 'react-router-dom'

enum SocialPlatformType {
  Twitter = 3,
  LinkedIn = 4
}

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
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(8, 'Password should contain 8-16 characters')
    .max(16, 'Password should contain 8-16 characters')
})

const Verify: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [checked, setChecked] = useState<SocialPlatformType>(SocialPlatformType.LinkedIn)
  const [accessToken, setAccessToken] = useState<string>('')
  const [thirdpartId, setThirdpartId] = useState<number>(0)
  const [isVerify, setIsVerify] = useState<boolean>(false)
  const [options, setOptions] = useState<(ISearchOption & any)[]>([])
  const { data: companyData } = useGetUserUnverify({ limit: 1500, name: '', offset: 0, userType: 0 })
  const { runAsync: runAsyncVerify, loading: verifyLoading } = useVerifyAccount()
  const { runAsync: runAsyncClaimCheck, loading: checkLoading } = useClaimCheck()
  const { handleOauth } = useOauth()
  const handleClaimCheck = async (accessToken: string) => {
    const { code, data } = await runAsyncClaimCheck({
      accessToken,
      claimType: checked,
      thirdpartId
    })
    if (code === 200) {
      setAccessToken(data?.accessToken ?? accessToken)
      setIsVerify(true)
    }
    if (code === 10454) {
      return toast.error('The logged in social account is inconsistent with the existing information.')
    }
    if (code === 10419) {
      // twitter
      return toast.error('The logged in social account is inconsistent with the existing information.')
    }
    if (code === 10408) {
      // linkedin
      return toast.error('Your account has been registered, please login')
    }
    return
  }
  const { linkedInLogin } = useLinkedInOauth(async accessToken => {
    handleClaimCheck(accessToken)
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(Number(event.target.value))
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const initialValues = {
    password: '',
    email: '',
    linkedIn: '',
    twitter: '',
    name: '',
    userType: 0
  }
  const handleOauthVerify = async () => {
    if (checked === SocialPlatformType.Twitter) {
      const accessToken = await handleOauth('twitter')
      handleClaimCheck(accessToken)
    } else {
      linkedInLogin()
    }
  }

  const handleSubmit = async (values: typeof initialValues) => {
    const res = await runAsyncVerify({
      accessToken,
      email: values.email.trim(),
      password: md5(values.password.trim()),
      claimType: checked,
      thirdpartId,
      userType: values.userType
    })
    const { code, data } = res
    if (code !== 200) {
      return toast.error('Verify failed')
    }
    dispatch(
      saveLoginInfo({
        token: data?.token,
        userId: data?.userId,
        userType: data?.userType
      })
    )
    if (data?.userType === USER_TYPE.USER) {
      dispatch(
        fetchUserInfo({
          userId: data?.userId
        })
      )
    } else {
      dispatch(
        fetchCompanyInfo({
          companyId: data?.userId,
          thirdpartId: 0,
          userId: data?.userId
        })
      )
    }
    show(DialogTips, {
      title: 'Сongratulations! You have successfully verify your account.',
      content: (
        <Typography variant="h2" sx={{ mt: 10 }}>
          Would you like to edit your profile now?
        </Typography>
      ),
      iconType: 'success',
      cancelBtn: 'Skip',
      againBtn: 'Edit Now',
      onClose: () => navigate(`/company/summary?id=${data?.userId}`),
      onCancel: () => navigate(`/company/summary?id=${data?.userId}`),
      onAgain: () => navigate('/company/edit')
    })
    return
  }
  useEffect(() => {
    if (companyData) {
      const resulst = companyData?.list?.map((item: { name: any; avatar: any }) => ({
        label: item?.name,
        icon: item?.avatar,
        value: item
      }))
      setOptions(resulst)
    }
  }, [companyData])
  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 40, width: 708, margin: '0 auto' }}>
        <PaperBox
          title="Verify your company"
          subTitle="Verify existing company through the relevant social account"
          sx={{ p: 32 }}
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {({ setValues, values }) => (
              <Stack component={Form} justifyContent="center" sx={{ width: 428, margin: '40px auto 0' }}>
                {isVerify ? (
                  <Box sx={{ border: '1px solid #D7D6D9', borderRadius: 20, p: '12px 20px' }}>
                    <Typography variant="body2" color={'var(--ps-gray-700)'}>
                      Name
                    </Typography>
                    <Typography variant="body1" color={'var(--ps-gray-900)'}>
                      {values.name}
                    </Typography>
                  </Box>
                ) : (
                  <FormItem name="id" label="Name" fieldType="custom">
                    <SearchInput
                      options={options}
                      loadingText="No result"
                      onChange={(_, value) => {
                        const result = companyData?.list?.filter((item: { name: string }) => item.name === value)
                        setValues({
                          ...values,
                          linkedIn: result.length ? result?.[0]?.linkedin : '',
                          twitter: result.length ? result?.[0]?.twitter : '',
                          name: result.length ? result?.[0]?.name : '',
                          userType: result.length ? result?.[0]?.userType : 0
                        })
                        setThirdpartId(result.length ? result?.[0]?.id : 0)
                        if (result?.[0]?.linkedin) {
                          return setChecked(SocialPlatformType.LinkedIn)
                        }
                        if (result?.[0]?.twitter) {
                          return setChecked(SocialPlatformType.Twitter)
                        }
                      }}
                      onSelect={(_, newValue) => {
                        const result = companyData?.list?.filter((item: { id: any }) => item.id === newValue.value.id)
                        setValues({
                          ...values,
                          linkedIn: result?.[0]?.linkedin,
                          twitter: result?.[0]?.twitter,
                          name: result.length ? result?.[0]?.name : '',
                          userType: result.length ? result?.[0]?.userType : 0
                        })
                        setThirdpartId(newValue.value?.id)
                        if (result?.[0]?.linkedin) {
                          return setChecked(SocialPlatformType.LinkedIn)
                        }
                        if (result?.[0]?.twitter) {
                          return setChecked(SocialPlatformType.Twitter)
                        }
                      }}
                    />
                  </FormItem>
                )}

                {values.linkedIn && (
                  <Box sx={{ mt: 20, display: 'flex', alignItems: 'center', columnGap: 10 }}>
                    <Image src={LinkedInSVG} width={40} height={40} alt="LinkedIn" />
                    <Stack sx={{ overflow: 'hidden', mr: 10 }}>
                      <Typography variant="body1" color="#000">
                        LinkedIn
                      </Typography>
                      <Typography
                        variant="body2"
                        color="var(--ps-gray-700)"
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {values.linkedIn}
                      </Typography>
                    </Stack>

                    {isVerify ? (
                      <>
                        {checked === SocialPlatformType.LinkedIn && (
                          <Stack direction="row" spacing={10} sx={{ ml: 'auto' }}>
                            <Typography variant="body1" color="#259C4A">
                              Success
                            </Typography>
                            <Image src={VerifySuccessSVG} width={20} height={20} alt="" />
                          </Stack>
                        )}
                      </>
                    ) : (
                      <Radio
                        checked={checked === SocialPlatformType.LinkedIn}
                        onChange={handleChange}
                        value={SocialPlatformType.LinkedIn}
                        icon={<UnCheckRadioSVG />}
                        checkedIcon={<CheckRadioSVG />}
                        sx={{ ml: 'auto', mr: 10 }}
                      />
                    )}
                  </Box>
                )}
                {values.twitter && (
                  <Box sx={{ mt: 20, display: 'flex', alignItems: 'center', columnGap: 10 }}>
                    <Image src={TwitterSVG} width={40} height={40} alt="LinkedIn" />
                    <Stack sx={{ overflow: 'hidden', mr: 10 }}>
                      <Typography variant="body1" color="#000">
                        Twitter
                      </Typography>
                      <Typography
                        variant="body2"
                        color="var(--ps-gray-700)"
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {values.twitter}
                      </Typography>
                    </Stack>
                    {isVerify ? (
                      <>
                        {checked === SocialPlatformType.Twitter && (
                          <Stack direction="row" spacing={10} sx={{ ml: 'auto' }}>
                            <Typography variant="body1" color="#259C4A">
                              Success
                            </Typography>
                            <Image src={VerifySuccessSVG} width={20} height={20} alt="" />
                          </Stack>
                        )}
                      </>
                    ) : (
                      <Radio
                        checked={checked === SocialPlatformType.Twitter}
                        onChange={handleChange}
                        value={SocialPlatformType.Twitter}
                        icon={<UnCheckRadioSVG />}
                        checkedIcon={<CheckRadioSVG />}
                        sx={{ ml: 'auto', mr: 10 }}
                      />
                    )}
                  </Box>
                )}

                {isVerify && (
                  <Box sx={{ mt: 20 }}>
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
                  </Box>
                )}
                {isVerify ? (
                  <LoadingButton variant="contained" loading={verifyLoading} sx={{ mt: 32, mb: 48 }} type="submit">
                    Verify
                  </LoadingButton>
                ) : (
                  <>
                    {thirdpartId ? (
                      <LoadingButton
                        variant="contained"
                        sx={{ mt: 32, mb: 48 }}
                        onClick={handleOauthVerify}
                        loading={checkLoading}
                      >
                        Verify through {checked === SocialPlatformType.Twitter ? 'Twitter' : 'Linkedin'}
                      </LoadingButton>
                    ) : (
                      <Button variant="outlined" sx={{ mt: 32, mb: 48 }}>
                        Verify
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            )}
          </Formik>
        </PaperBox>
      </Box>
    </Container>
  )
}

export default Verify
