import { Box, Button, IconButton, OutlinedInput, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { ReactNode } from 'react'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { IEditProps } from '../overview'
import styles from './styles'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as EmailSVG } from 'assets/imgs/profile/links/email.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/profile/links/website.svg'
import { ReactComponent as LinkedInSVG } from 'assets/imgs/profile/links/linkedIn.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/profile/links/github.svg'
import { ReactComponent as TwitterSVG } from 'assets/imgs/profile/links/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/profile/links/instagram.svg'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import EditLayout, { profileTabsList } from 'bounceComponents/company/EditLayout'
import { ActionType } from 'bounceComponents/profile/components/BasicContextProvider'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import { formCheckValid } from 'utils'
import { FormType } from 'api/profile/type'
import { useUserInfo } from 'state/users/hooks'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

export interface ILinksItem {
  name: string
  label: string
  required: boolean
  icon: ReactNode | string
  autoComplete: string
}
export interface ISocialLinksProps {
  links: ILinksItem[]
}

export const SocialLinks: React.FC<ISocialLinksProps> = ({ links }) => {
  return (
    <>
      {links.map(item => (
        <FormItem
          key={item.name}
          name={item.name}
          label={item.label}
          required={item.required}
          startAdornment={<IconButton sx={styles.iconBtn}>{item.icon}</IconButton>}
        >
          <OutlinedInput />
        </FormItem>
      ))}
    </>
  )
}

const links: ILinksItem[] = [
  {
    name: 'contactEmail',
    label: 'Official email',
    required: true,
    icon: <EmailSVG />,
    autoComplete: ''
  },
  {
    name: 'website',
    label: 'Website',
    required: false,
    icon: <WebsiteSVG />,
    autoComplete: 'off'
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    required: false,
    icon: <LinkedInSVG />,
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

const validationSchema = yup.object({
  contactEmail: yup
    .string()
    .trim()
    .required(formCheckValid('Official email', FormType.Input))
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect official email')
    .email('Please enter a valid email'),
  website: yup.string().trim().url('Please enter a valie URL'),
  linkedin: yup.string().trim().url('Please enter a valie URL'),
  github: yup.string().trim().url('Please enter a valie URL'),
  twitter: yup.string().trim().url('Please enter a valie URL'),
  instagram: yup.string().trim().url('Please enter a valie URL')
})

export const SocialList: React.FC<IEditProps> = ({ firstEdit, basicProfileValues, basicProfileDispatch }) => {
  const { userInfo } = useUserInfo()
  const { loading, runAsync: runUpdateBasic } = useUpdateBasic()

  const initialValues = {
    contactEmail: basicProfileValues?.contactEmail || userInfo?.contactEmail || '',
    website: basicProfileValues?.website || userInfo?.website || '',
    linkedin: basicProfileValues?.linkedin || userInfo?.linkedin || '',
    github: basicProfileValues?.github || userInfo?.github || '',
    twitter: basicProfileValues?.twitter || userInfo?.twitter || '',
    instagram: basicProfileValues?.instagram || userInfo?.instagram || ''
  }

  const handleSubmit = (values: any) => {
    if (firstEdit) {
      return basicProfileDispatch?.({
        type: ActionType.SetSocial,
        payload: {
          ...values
        }
      })
    }
    runUpdateBasic(values)
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ dirty, resetForm }) => (
        <Stack component={Form} spacing={20} noValidate>
          <LeavePageWarn dirty={dirty || !!(firstEdit && basicProfileValues?.activeStep !== 3)} />
          {firstEdit && (
            <Typography variant="h2" mb={20}>
              Link your socials
            </Typography>
          )}
          <SocialLinks links={links} />
          <Box sx={{ textAlign: 'right' }}>
            {firstEdit && (
              <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                <EditCancelConfirmation onResetForm={resetForm} routerLink="/profile/summary" />
                <Button variant="contained" sx={{ width: 140 }} type="submit">
                  Next
                </Button>
              </Stack>
            )}
            {!firstEdit && (
              <LoadingButton loading={loading} variant="contained" sx={{ width: 140, mt: 40 }} type="submit">
                Submit
              </LoadingButton>
            )}
          </Box>
        </Stack>
      )}
    </Formik>
  )
}

export const SocialListPage: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.profile.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={profileTabsList} title="Edit summary" goBack={goBack}>
        <SocialList />
      </EditLayout>
    </section>
  )
}

export default SocialListPage
