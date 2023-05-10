import { Stack } from '@mui/material'

import SocialMediaButton from './SocialMediaButton'

import { ReactComponent as TwitterSVG } from 'assets/imgs/auction/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/auction/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/auction/website.svg'
import { ReactComponent as LinkedinSVG } from 'assets/imgs/auction/linkedin.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/auction/github.svg'
import { ReactComponent as EmailSVG } from 'assets/imgs/auction/email.svg'

export interface SocialMediaButtonGroupProps {
  email?: string
  shouldShowEmailButton?: boolean
  twitter?: string
  instagram?: string
  website?: string
  linkedin?: string
  github?: string
  style?: React.CSSProperties
}

const SocialMediaButtonGroup = ({
  email,
  shouldShowEmailButton,
  twitter,
  instagram,
  website,
  linkedin,
  style,
  github
}: SocialMediaButtonGroupProps) => {
  return (
    <Stack spacing={8} direction="row" sx={{ mt: 20, ...style }}>
      {email && shouldShowEmailButton ? (
        <SocialMediaButton href={`mailto:${email}`}>
          <EmailSVG />
        </SocialMediaButton>
      ) : null}

      {twitter && (
        <SocialMediaButton href={twitter}>
          <TwitterSVG />
        </SocialMediaButton>
      )}
      {instagram && (
        <SocialMediaButton href={instagram}>
          <InstagramSVG />
        </SocialMediaButton>
      )}
      {website && (
        <SocialMediaButton href={website}>
          <WebsiteSVG />
        </SocialMediaButton>
      )}
      {linkedin && (
        <SocialMediaButton href={linkedin}>
          <LinkedinSVG />
        </SocialMediaButton>
      )}
      {github && (
        <SocialMediaButton href={github}>
          <GithubSVG />
        </SocialMediaButton>
      )}
    </Stack>
  )
}

export default SocialMediaButtonGroup
