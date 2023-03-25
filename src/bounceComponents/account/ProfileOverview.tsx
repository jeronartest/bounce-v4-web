import { Box, OutlinedInput, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import FormItem from 'bounceComponents/common/FormItem'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import UploadItem from 'bounceComponents/common/UploadCard/UploadItem'
import LocationTimeZone from 'bounceComponents/common/LocationTimeZone'
// import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import { FormType } from 'api/profile/type'
import { formCheckValid } from 'utils'
import { useUserInfo } from 'state/users/hooks'

import { ReactComponent as WebsiteSVG } from 'assets/imgs/profile/links/website.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/profile/links/github.svg'
import { ReactComponent as TwitterSVG } from 'assets/imgs/profile/links/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/profile/links/instagram.svg'
import { ReactNode } from 'react'
import { SocialLinks } from 'bounceComponents/profile/SocialList'

export interface ILinksItem {
  name: string
  label: string
  required: boolean
  icon: ReactNode | string
  autoComplete: string
}

const links: ILinksItem[] = [
  {
    name: 'website',
    label: 'Website',
    required: false,
    icon: <WebsiteSVG />,
    autoComplete: 'off'
  },
  {
    name: 'github',
    label: 'Github',
    required: false,
    icon: <GithubSVG />,
    autoComplete: 'off'
  },
  {
    name: 'twitter',
    label: 'Twitter',
    required: false,
    icon: <TwitterSVG />,
    autoComplete: 'off'
  },
  {
    name: 'instagram',
    label: 'Instagram',
    required: false,
    icon: <InstagramSVG />,
    autoComplete: 'off'
  }
]

const DESCRIPTION_LENGTH = 350

const validationSchema = yup.object({
  avatar: yup.object({
    fileName: yup.string(),
    fileSize: yup.number(),
    fileThumbnailUrl: yup.string(),
    fileType: yup.string(),
    fileUrl: yup.string().required('Please upload your Profile Picture'),
    id: yup.number()
  }),
  fullName: yup
    .string()
    .trim()
    .required(formCheckValid('Full name', FormType.Input))
    .max(300, 'Allow only no more than 300 letters')
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect full name'),
  description: yup.string().trim().max(DESCRIPTION_LENGTH, `Allow only no more than ${DESCRIPTION_LENGTH} letters`),
  location: yup.string().required(formCheckValid('location（time zone）', FormType.Select)),
  website: yup.string().trim().url('Please enter a valid URL'),
  github: yup.string().trim().url('Please enter a valid URL'),
  twitter: yup.string().trim().url('Please enter a valid URL'),
  instagram: yup.string().trim().url('Please enter a valid URL')
})

const ProfileOverview = () => {
  const { userInfo } = useUserInfo()

  const { loading, runAsync: runUpdateBasic } = useUpdateBasic()

  const initialValues = {
    avatar: userInfo?.avatar || {
      fileName: '',
      fileSize: 0,
      fileThumbnailUrl: '',
      fileType: '',
      fileUrl: '',
      id: 0
    },
    fullName: userInfo?.fullName || '',
    description: userInfo?.description || '',

    location: userInfo?.location || '',
    website: userInfo?.website || '',
    github: userInfo?.github || '',
    twitter: userInfo?.twitter || '',
    instagram: userInfo?.instagram || ''
  }

  const handleSubmit = (values: any) => {
    runUpdateBasic(values)
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        return (
          <Stack component={Form} spacing={20} noValidate>
            <Box
              sx={{
                position: 'absolute',
                right: 60,
                top: 30
              }}
            >
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<></>}
                variant="contained"
                sx={{ width: 140, textAlign: 'right' }}
                type="submit"
              >
                Save
              </LoadingButton>
            </Box>

            <FormItem
              label="Profile Picture"
              name="avatar"
              tips="(JPEG, PNG, WEBP Files, Size<10M)"
              fieldType="custom"
              sx={{
                '& label': {
                  position: 'absolute',
                  left: 184,
                  top: 46,
                  fontSize: 14,
                  color: 'var(--ps-gray-900)'
                },
                '&>p': {
                  position: 'absolute',
                  left: 184,
                  top: 78,
                  fontSize: 12,
                  color: 'var(--ps-gray-600)'
                }
              }}
            >
              <UploadItem
                value={{
                  fileUrl: values.avatar.fileThumbnailUrl || values.avatar.fileUrl
                }}
                onChange={file => {
                  setFieldValue('avatar', file)
                }}
                sx={{ width: 160, height: 160, display: 'flex', borderRadius: '50%', objectFit: 'cover' }}
                accept={['image/jpeg', 'image/png', 'image/webp']}
                tips={'Only JPEG, PNG, WEBP Files, Size<10M'}
                limitSize={10}
              />
            </FormItem>

            <FormItem name="fullName" label="Full name" required style={{ marginTop: 40 }}>
              <OutlinedInput />
            </FormItem>
            <FormItem name="location" label="Location (Time Zone)" required fieldType="custom">
              <LocationTimeZone value={values.location} onChange={val => setFieldValue('location', val)} />
            </FormItem>
            <FormItem name="description" label=" ">
              <OutlinedInput
                placeholder="Introduce yourself..."
                multiline
                endAdornment={
                  <Typography
                    variant="body2"
                    className="endAdorn"
                  >{`${values.description?.length} / ${DESCRIPTION_LENGTH}`}</Typography>
                }
                inputProps={{ sx: { minHeight: 144 } }}
              />
            </FormItem>

            <Typography variant="h3" pt={20} fontSize={16}>
              Social links
            </Typography>
            <SocialLinks links={links} />
          </Stack>
        )
      }}
    </Formik>
  )
}

export default ProfileOverview
