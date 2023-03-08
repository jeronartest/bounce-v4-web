import { Box, Button, IconButton, OutlinedInput, Stack } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { ReactNode } from 'react'
import * as yup from 'yup'
import styles from './styles'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as EmailSVG } from 'assets/imgs/profile/links/email.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/profile/links/website.svg'
import { ReactComponent as LinkedInSVG } from 'assets/imgs/profile/links/linkedIn.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/profile/links/github.svg'
import { ReactComponent as TwitterSVG } from 'assets/imgs/profile/links/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/profile/links/instagram.svg'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import { useUserInfo } from 'state/users/hooks'

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
  contactEmail: yup.string().trim().required('Official email is required').email('Please enter a valid email'),
  website: yup.string().trim().url('Please enter a valie URL'),
  linkedin: yup.string().trim().url('Please enter a valie URL'),
  github: yup.string().trim().url('Please enter a valie URL'),
  twitter: yup.string().trim().url('Please enter a valie URL'),
  instagram: yup.string().trim().url('Please enter a valie URL')
})

const SocialList: React.FC = () => {
  const { userInfo } = useUserInfo()
  const { runAsync: runUpdateBasic } = useUpdateBasic()

  const initialValues = {
    contactEmail: userInfo?.contactEmail || '',
    website: userInfo?.website || '',
    linkedin: userInfo?.linkedin || '',
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
      {() => (
        <Stack component={Form} spacing={20} noValidate>
          <SocialLinks links={links} />
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" sx={{ width: 140, mt: 40 }} type="submit">
              Submit
            </Button>
          </Box>
        </Stack>
      )}
    </Formik>
  )
}

export default SocialList
