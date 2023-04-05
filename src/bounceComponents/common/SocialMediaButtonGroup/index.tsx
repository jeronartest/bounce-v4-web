import React from 'react'
import { Stack, SxProps } from '@mui/material'

import { useSelector } from 'react-redux'
import SocialMediaButton from './SocialMediaButton'

import { ReactComponent as TwitterSVG } from 'assets/imgs/auction/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/auction/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/auction/website.svg'
import { ReactComponent as LinkedinSVG } from 'assets/imgs/auction/linkedin.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/auction/github.svg'
import { ReactComponent as EmailSVG } from 'assets/imgs/auction/email.svg'
import { RootState } from '@/store'

export interface SocialMediaButtonGroupProps {
  containerSx?: SxProps
  spacing?: number
  buttonSize?: number
  href: { email?: string; twitter?: string; instagram?: string; website?: string; linkedin?: string; github?: string }
}

const SocialMediaButtonGroup = ({ containerSx, spacing, buttonSize, href }: SocialMediaButtonGroupProps) => {
  const { token } = useSelector((state: RootState) => state.user)

  return (
    <Stack spacing={spacing || 8} direction="row" sx={containerSx}>
      {href?.email && !!token ? (
        <SocialMediaButton size={buttonSize} href={`mailto:${href?.email}`}>
          <EmailSVG />
        </SocialMediaButton>
      ) : null}

      {href?.twitter && (
        <SocialMediaButton size={buttonSize} href={href?.twitter}>
          <TwitterSVG />
        </SocialMediaButton>
      )}
      {href?.instagram && (
        <SocialMediaButton size={buttonSize} href={href?.instagram}>
          <InstagramSVG />
        </SocialMediaButton>
      )}
      {href?.website && (
        <SocialMediaButton size={buttonSize} href={href?.website}>
          <WebsiteSVG />
        </SocialMediaButton>
      )}
      {href?.linkedin && (
        <SocialMediaButton size={buttonSize} href={href?.linkedin}>
          <LinkedinSVG />
        </SocialMediaButton>
      )}
      {href?.github && (
        <SocialMediaButton size={buttonSize} href={href?.github}>
          <GithubSVG />
        </SocialMediaButton>
      )}
    </Stack>
  )
}

export default SocialMediaButtonGroup
