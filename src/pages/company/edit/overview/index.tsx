import { Box, Button, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'
import Head from 'next/head'
import styles from './styles'
import UploadItem from 'bounceComponents/common/UploadCard/UploadItem'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as EmailSVG } from 'assets/imgs/profile/links/email.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/profile/links/website.svg'
import { ReactComponent as LinkedInSVG } from 'assets/imgs/profile/links/linkedIn.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/profile/links/github.svg'
import { ReactComponent as TwitterSVG } from 'assets/imgs/profile/links/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/profile/links/instagram.svg'
import { ReactComponent as MediumSVG } from 'assets/imgs/profile/links/medium.svg'
import LocationTimeZone, { timezone } from 'bounceComponents/common/LocationTimeZone'
import { RootState } from '@/store'
import { useUpdateCompany } from 'bounceHooks/company/useUpdateCompany'
import DateMonthPicker from 'bounceComponents/common/DateMonthPicker'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import { ILinksItem } from 'pages/profile/edit/social'
import { SocialLinks } from 'bounceComponents/profile/SocialList'
import { ICompanyProfileParams } from 'api/company/type'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { CompanyActionType } from 'bounceComponents/company/components/CompanyContextProvider'
import { formCheckValid } from '@/utils'
import { FormType } from 'api/profile/type'

const links: ILinksItem[] = [
  {
    name: 'companyBasicInfo.contactEmail',
    label: 'Official email',
    required: true,
    icon: <EmailSVG />,
    autoComplete: ''
  },
  {
    name: 'companyBasicInfo.website',
    label: 'Website',
    required: false,
    icon: <WebsiteSVG />,
    autoComplete: 'off'
  },
  {
    name: 'companyBasicInfo.linkedin',
    label: 'LinkedIn',
    required: false,
    icon: <LinkedInSVG />,
    autoComplete: 'off'
  },
  {
    name: 'companyBasicInfo.github',
    label: 'Github',
    required: false,
    icon: <GithubSVG />,
    autoComplete: 'off'
  },
  {
    name: 'companyBasicInfo.twitter',
    label: 'Twitter',
    required: false,
    icon: <TwitterSVG />,
    autoComplete: 'off'
  },
  {
    name: 'companyBasicInfo.instagram',
    label: 'Instagram',
    required: false,
    icon: <InstagramSVG />,
    autoComplete: 'off'
  },
  {
    name: 'companyBasicInfo.medium',
    label: 'Medium',
    required: false,
    icon: <MediumSVG />,
    autoComplete: 'off'
  }
]

const DESCRIPTION_LENGTH = 350
const BRIEF_INTRO_LENGTH = 140

const validationSchema = yup.object().shape({
  companyBasicInfo: yup.object({
    avatar: yup.object({
      fileName: yup.string(),
      fileSize: yup.number(),
      fileThumbnailUrl: yup.string(),
      fileType: yup.string(),
      fileUrl: yup.string().required('Please upload your profile picture'),
      id: yup.number()
    }),
    companyName: yup
      .string()
      .trim()
      .required(formCheckValid('Company Name', FormType.Input))
      .max(300, 'Allow only no more than 300 letters')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect company name'),
    location: yup.string().required(formCheckValid('location（time zone）', FormType.Select)),
    companyState: yup.number().required(formCheckValid('Company State', FormType.Select)),
    startupDate: yup
      .number()
      .required(formCheckValid('Start Date', FormType.Select))
      .min(1, formCheckValid('Start Date', FormType.Select))
      .max(moment().unix(), 'Incorrect date. Start date should be earlier than the current date'),
    marketType: yup.number().required(formCheckValid('Market Type', FormType.Select)),
    companySize: yup.number().required(formCheckValid('Company size', FormType.Select)),
    companyBriefIntro: yup
      .string()
      ?.trim()
      .required('Please introduce your company with short description')
      .max(BRIEF_INTRO_LENGTH, `Allow only no more than ${BRIEF_INTRO_LENGTH} letters`),
    companyFullIntro: yup
      .string()
      ?.trim()
      .required('Please introduce in details')
      .max(DESCRIPTION_LENGTH, `Allow only no more than ${DESCRIPTION_LENGTH} letters`),

    contactEmail: yup
      .string()
      ?.trim()
      .required(formCheckValid('Official email', FormType.Input))
      .email('Please enter a valid email')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect official email'),
    website: yup.string()?.trim().url('Please enter a valie URL'),
    linkedin: yup.string()?.trim().url('Please enter a valie URL'),
    github: yup.string()?.trim().url('Please enter a valie URL'),
    twitter: yup.string()?.trim().url('Please enter a valie URL'),
    instagram: yup.string()?.trim().url('Please enter a valie URL'),
    medium: yup.string()?.trim().url('Please enter a valie URL')
  })
})

export interface ICompanyOverviewEditProps {
  companyProfileValues?: ICompanyProfileParams
  firstEdit?: boolean
  companyProfileDispatch?: (val: any) => void
}

export const CompanyOverviewEdit: React.FC<ICompanyOverviewEditProps> = ({
  companyProfileValues,
  firstEdit,
  companyProfileDispatch
}) => {
  const { companyInfo } = useSelector((state: RootState) => state.user)
  const { loading, runAsync: runUpdateCompany } = useUpdateCompany(firstEdit)

  const initialValues = {
    companyBasicInfo: {
      avatar: companyProfileValues?.companyBasicInfo?.avatar ||
        companyInfo?.avatar || {
          fileName: '',
          fileSize: 0,
          fileThumbnailUrl: '',
          fileType: '',
          fileUrl: '',
          id: 0
        },
      companyName: companyProfileValues?.companyBasicInfo?.companyName || companyInfo?.companyName || '',
      location: companyProfileValues?.companyBasicInfo?.location || companyInfo?.location || '',
      timezone: companyProfileValues?.companyBasicInfo?.timezone || timezone.toString() || companyInfo?.timezone,
      companyState: companyProfileValues?.companyBasicInfo?.companyState || companyInfo?.companyState || '',
      marketType: companyProfileValues?.companyBasicInfo?.marketType || companyInfo?.marketType || '',
      companySize: companyProfileValues?.companyBasicInfo?.companySize || companyInfo?.companySize || '',
      companyBriefIntro: companyProfileValues?.companyBasicInfo?.companyBriefIntro || companyInfo?.briefIntro || '',
      companyFullIntro: companyProfileValues?.companyBasicInfo?.companyFullIntro || companyInfo?.about || '',
      startupDate: companyProfileValues?.companyBasicInfo?.startupDate || companyInfo?.startupDate || 0,

      contactEmail: companyProfileValues?.companyBasicInfo?.contactEmail || companyInfo?.contactEmail || '',
      website: companyProfileValues?.companyBasicInfo?.website || companyInfo?.website || '',
      linkedin: companyProfileValues?.companyBasicInfo?.linkedin || companyInfo?.linkedin || '',
      github: companyProfileValues?.companyBasicInfo?.github || companyInfo?.github || '',
      twitter: companyProfileValues?.companyBasicInfo?.twitter || companyInfo?.twitter || '',
      instagram: companyProfileValues?.companyBasicInfo?.instagram || companyInfo?.instagram || '',
      medium: companyProfileValues?.companyBasicInfo?.medium || companyInfo?.medium || ''
    }
  }

  const handleSubmit = values => {
    const tempVal = {
      companyBasicInfo: {
        ...values.companyBasicInfo,
        companyName: values.companyBasicInfo?.companyName?.trim(),
        companyBriefIntro: values.companyBasicInfo?.companyBriefIntro?.trim(),
        companyFullIntro: values.companyBasicInfo?.companyFullIntro?.trim(),
        contactEmail: values.companyBasicInfo?.contactEmail?.trim(),
        website: values.companyBasicInfo?.website?.trim(),
        linkedin: values.companyBasicInfo?.linkedin?.trim(),
        github: values.companyBasicInfo?.github?.trim(),
        twitter: values.companyBasicInfo?.twitter?.trim(),
        instagram: values.companyBasicInfo?.instagram?.trim(),
        medium: values.companyBasicInfo?.medium?.trim(),
        companyState: Number(values.companyBasicInfo?.companyState),
        marketType: Number(values.companyBasicInfo?.marketType),
        companySize: Number(values.companyBasicInfo?.companySize)
      }
    }
    if (firstEdit) {
      return companyProfileDispatch?.({
        type: CompanyActionType.SetIntro,
        payload: {
          ...companyProfileValues,
          ...tempVal
        }
      })
    }
    runUpdateCompany(tempVal)
  }

  const optionDatas = useSelector((state: RootState) => state.configOptions.optionDatas)

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, dirty, resetForm }) => {
        return (
          <Stack component={Form} spacing={20} noValidate>
            <LeavePageWarn dirty={dirty || (firstEdit && companyProfileValues?.activeStep !== 5)} />
            {firstEdit && <Typography variant="h2">Introduction</Typography>}
            {!firstEdit && (
              <FormItem
                label="Profile Picture"
                name={'companyBasicInfo.avatar'}
                tips="(JPEG, PNG, WEBP Files, Size<10M)"
                fieldType="custom"
                sx={styles.fileItem}
              >
                <UploadItem
                  value={{
                    fileUrl: values.companyBasicInfo.avatar.fileThumbnailUrl || values.companyBasicInfo.avatar.fileUrl
                  }}
                  onChange={file => {
                    setFieldValue('companyBasicInfo.avatar', file)
                  }}
                  sx={{ width: 160, height: 160, display: 'flex', borderRadius: '50%', objectFit: 'cover' }}
                  accept={['image/jpeg', 'image/png', 'image/webp']}
                  tips={'Only JPEG, PNG, WEBP Files, Size<10M'}
                  limitSize={10}
                />
              </FormItem>
            )}

            <FormItem name="companyBasicInfo.companyName" label="Company Name" required style={{ marginTop: 40 }}>
              <OutlinedInput />
            </FormItem>
            <FormItem name="companyBasicInfo.location" label="Location (Time Zone)" required fieldType="custom">
              <LocationTimeZone
                value={values.companyBasicInfo.location}
                onChange={val => setFieldValue('companyBasicInfo.location', val)}
              />
            </FormItem>
            <FormItem name="companyBasicInfo.startupDate" label="Start Date" required fieldType="custom">
              <DateMonthPicker
                value={values.companyBasicInfo.startupDate}
                onChange={val => {
                  const { year, month } = val
                  const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                  setFieldValue('companyBasicInfo.startupDate', moment(`${year}-${tempMonth}-01`).unix())
                }}
              />
            </FormItem>
            <FormItem name="companyBasicInfo.companyState" label="Company State" required>
              <Select>
                {optionDatas?.companyStateOpt?.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.state}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormItem>
            <FormItem name="companyBasicInfo.marketType" label="Market Type" required>
              <Select>
                {optionDatas?.marketTypeOpt?.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.marketType}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormItem>
            <FormItem name="companyBasicInfo.companySize" label="Company size" required>
              <Select>
                {optionDatas?.companySizeOpt?.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.size}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormItem>
            <FormItem name="companyBasicInfo.companyBriefIntro" label=" ">
              <OutlinedInput
                placeholder="Introduce your company with short description"
                multiline
                endAdornment={
                  <Typography
                    variant="body2"
                    className="endAdorn"
                  >{`${values?.companyBasicInfo?.companyBriefIntro?.length} / ${BRIEF_INTRO_LENGTH}`}</Typography>
                }
                className="areaInput"
                inputProps={{ sx: { minHeight: 84 } }}
              />
            </FormItem>
            <FormItem name="companyBasicInfo.companyFullIntro" label=" ">
              <OutlinedInput
                placeholder="Introduce in details"
                multiline
                endAdornment={
                  <Typography
                    variant="body2"
                    className="endAdorn"
                  >{`${values?.companyBasicInfo?.companyFullIntro?.length} / ${DESCRIPTION_LENGTH}`}</Typography>
                }
                className="areaInput"
                inputProps={{ sx: { minHeight: 144 } }}
              />
            </FormItem>
            <Typography variant="h3" sx={{ fontSize: 16, lineHeight: '20px' }} style={{ marginTop: 36 }}>
              Link your socials
            </Typography>
            <SocialLinks links={links} />
            <Box sx={{ textAlign: 'right' }}>
              {firstEdit && (
                <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                  <EditCancelConfirmation onResetForm={resetForm} routerLink="/company/summary" />
                  <Button variant="contained" sx={{ width: 140 }} type="submit">
                    Next
                  </Button>
                </Stack>
              )}
              {!firstEdit && (
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  sx={{ width: 140, mt: 40, textAlign: 'right' }}
                  type="submit"
                >
                  Submit
                </LoadingButton>
              )}
            </Box>
          </Stack>
        )
      }}
    </Formik>
  )
}

const CompanyOverviewEditPage: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/company/summary?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Summary | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <CompanyOverviewEdit />
      </EditLayout>
    </section>
  )
}

export default CompanyOverviewEditPage
