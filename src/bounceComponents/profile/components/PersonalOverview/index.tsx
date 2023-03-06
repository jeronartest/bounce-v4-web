import { Box, Grid, IconButton, Link, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'
import { ExperienctAndSkill } from '../PortfolioPreference'
import { ReactComponent as EmailSVG } from './assets/email.svg'
import { ReactComponent as TwitterIconSVG } from './assets/twitter.svg'
import { ReactComponent as InstagramIconSVG } from './assets/instagram.svg'
import { ReactComponent as WebsiteSVG } from './assets/website.svg'
import { ReactComponent as LinkedinSVG } from './assets/linkedin.svg'
import { ReactComponent as GithubSVG } from './assets/github.svg'
import ClockSVG from './assets/clock.svg'
import styles from './styles'
import { getPrimaryRoleLabel } from 'utils'
import { IProfileUserInfo } from 'api/user/type'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import EducationDefaultSVG from 'assets/imgs/defaultAvatar/education.svg'
import { useOptionDatas } from 'state/configOptions/hooks'

countries.registerLocale(english)

const userTimezone = new Date().getTimezoneOffset() / -60

interface IPersonalOverview {
  personalInfo: IProfileUserInfo
}

const PersonalOverview: React.FC<IPersonalOverview> = ({ personalInfo }) => {
  const optionDatas = useOptionDatas()
  const linkIcon = useMemo(
    () => [
      {
        link: personalInfo?.contactEmail,
        isMail: true,
        icon: <EmailSVG />
      },
      {
        link: personalInfo?.twitter,
        isMail: false,
        icon: <TwitterIconSVG />
      },
      {
        link: personalInfo?.instagram,
        isMail: false,
        icon: <InstagramIconSVG />
      },
      {
        link: personalInfo?.website,
        isMail: false,
        icon: <WebsiteSVG />
      },
      {
        link: personalInfo?.linkedin,
        isMail: false,
        icon: <LinkedinSVG />
      },
      {
        link: personalInfo?.github,
        isMail: false,
        icon: <GithubSVG />
      }
    ],
    [personalInfo]
  )

  return (
    <Box px={48} mb={48}>
      <Stack direction={'row'} justifyContent="space-between">
        <Typography variant="h2" sx={{ fontSize: 24, lineHeight: '32px' }}>
          Overview
        </Typography>
        <Stack direction={'row'} alignItems="center" sx={styles.linkBox} spacing={9}>
          {linkIcon?.map((item, index) => {
            return (
              <Box key={index} sx={{ display: item.link ? 'block' : 'none' }}>
                {item.link && (
                  <a target={'_blank'} href={item.isMail ? `mailto:${item.link}` : item.link} rel="noreferrer">
                    <IconButton>{item.icon}</IconButton>
                  </a>
                )}
              </Box>
            )
          })}
        </Stack>
      </Stack>
      <Box sx={{ mt: 24, mb: 32 }}>
        <ExperienctAndSkill personalInfo={personalInfo} />
      </Box>

      <Stack direction={'row'} justifyContent="space-between" mt={18}>
        <Box sx={{ maxWidth: 620 }}>
          <Grid container spacing={8} rowGap={32}>
            <Grid item xs={12}>
              <Typography variant="body2" color="var(--ps-gray-700)">
                About
              </Typography>
              <Typography variant="body1" mt={6}>
                {personalInfo?.description || 'No description yet'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="var(--ps-gray-700)">
                Company role
              </Typography>
              <Typography variant="body1" mt={6}>
                {getPrimaryRoleLabel(personalInfo?.companyRole, optionDatas?.primaryRoleOpt) || '-'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Location
              </Typography>
              <Box>
                {personalInfo?.location && personalInfo?.timezone ? (
                  <Stack direction={'row'} alignItems="center">
                    <Typography variant="body1" mr={6}>
                      {countries.getName(personalInfo?.location, 'en')}
                    </Typography>

                    <Typography variant="body1">(</Typography>
                    <picture>
                      <img src={ClockSVG} alt="clock" />
                    </picture>

                    <Typography variant="body1">
                      {`${new Date().getHours() + Number(personalInfo?.timezone) - userTimezone}:${(
                        Array(2).join('0') + new Date().getMinutes()
                      ).slice(-2)})`}
                    </Typography>
                  </Stack>
                ) : (
                  '-'
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Company
              </Typography>
              {personalInfo?.company?.name ? (
                <Stack
                  component={Link}
                  direction="row"
                  alignItems={'center'}
                  target={personalInfo?.company?.link ? '_blank' : '_self'}
                  href={personalInfo?.company?.link ? personalInfo?.company?.link : 'javascript:void(0)'}
                  rel="noreferrer"
                >
                  <picture>
                    <img
                      src={personalInfo?.company?.avatar || CompanyDefaultSVG}
                      width={40}
                      height={40}
                      style={{
                        borderRadius: '50%'
                      }}
                    />
                  </picture>
                  <Typography
                    variant="body1"
                    color="var(--ps-blue)"
                    ml={12}
                    sx={{
                      '&:hover': {
                        cursor: personalInfo?.company?.link ? 'pointer' : 'default',
                        textDecoration: personalInfo?.company?.link ? 'underline' : 'none'
                      }
                    }}
                  >
                    {personalInfo?.company?.name}
                  </Typography>
                </Stack>
              ) : (
                '-'
              )}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Education
              </Typography>
              {personalInfo?.university?.name ? (
                <Stack
                  component={Link}
                  direction="row"
                  alignItems={'center'}
                  target={personalInfo?.university?.link ? '_blank' : '_self'}
                  href={personalInfo?.university?.link ? personalInfo?.university?.link : 'javascript:void(0)'}
                  rel="noreferrer"
                >
                  <picture>
                    <img
                      src={personalInfo?.university?.avatar || EducationDefaultSVG}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  </picture>
                  <Typography
                    variant="body1"
                    color="var(--ps-blue)"
                    ml={12}
                    sx={{
                      '&:hover': {
                        cursor: personalInfo?.university?.link ? 'pointer' : 'default',
                        textDecoration: personalInfo?.university?.link ? 'underline' : 'none'
                      }
                    }}
                  >
                    {personalInfo?.university?.name}
                  </Typography>
                </Stack>
              ) : (
                '-'
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  )
}

export default PersonalOverview
