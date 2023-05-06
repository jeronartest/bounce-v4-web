import { Box, Button, IconButton, OutlinedInput, Stack } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { ReactNode } from 'react'
import * as yup from 'yup'
import styles from './styles'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/profile/links/website.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/profile/links/github.svg'
import { ReactComponent as TwitterSVG } from 'assets/imgs/profile/links/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/profile/links/instagram.svg'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import { useUserInfo } from 'state/users/hooks'
import Divider from 'components/Divider'

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
    <Stack spacing={20}>
      {links.map((item, index) => (
        <>
          <FormItem
            key={item.name}
            name={item.name}
            label={item.label}
            required={item.required}
            startAdornment={<IconButton sx={styles.iconBtn}>{item.icon}</IconButton>}
          >
            <OutlinedInput />
          </FormItem>
          <Divider key={index} />
        </>
      ))}
    </Stack>
  )
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

const validationSchema = yup.object({
  website: yup.string().trim().url('Please enter a valie URL'),
  github: yup.string().trim().url('Please enter a valie URL'),
  twitter: yup.string().trim().url('Please enter a valie URL'),
  instagram: yup.string().trim().url('Please enter a valie URL')
})

const SocialList: React.FC = () => {
  const { userInfo } = useUserInfo()
  const { runAsync: runUpdateBasic } = useUpdateBasic()

  const initialValues = {
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
      {() => (
        <Stack component={Form} spacing={20} noValidate>
          <SocialLinks links={links} />
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" sx={{ width: 140, mt: 20 }} type="submit">
              Save
            </Button>
          </Box>
        </Stack>
      )}
    </Formik>
  )
}

export default SocialList
