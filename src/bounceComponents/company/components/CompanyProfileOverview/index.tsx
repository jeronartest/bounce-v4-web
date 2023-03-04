import { Box, Button, Grid, IconButton, Link, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'
import { useRouter } from 'next/router'
import moment from 'moment'
import styles from './styles'
import { ReactComponent as TwitterIconSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/twitter.svg'
import { ReactComponent as InstagramIconSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/website.svg'
import { ReactComponent as LinkedinSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/linkedin.svg'
import { ReactComponent as GithubSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/github.svg'
import ClockSVG from 'bounceComponents/profile/components/PersonalOverview/assets/clock.svg'
import { ReactComponent as EmailSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/email.svg'
import { RootState } from '@/store'
import { getLabel } from '@/utils'
import { ICompanyOverviewInfo } from 'api/company/type'

countries.registerLocale(english)

const userTimezone = new Date().getTimezoneOffset() / -60

interface IPersonalOverview {
  companyInfo: ICompanyOverviewInfo
}

const CompanyProfileOverview: React.FC<IPersonalOverview> = ({ companyInfo }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const router = useRouter()

  const linkIcon = useMemo(
    () => [
      {
        link: companyInfo?.contactEmail,
        isMail: true,
        icon: <EmailSVG />
      },
      {
        link: companyInfo?.twitter,
        isMail: false,
        icon: <TwitterIconSVG />
      },
      {
        link: companyInfo?.instagram,
        isMail: false,
        icon: <InstagramIconSVG />
      },
      {
        link: companyInfo?.website,
        isMail: false,
        icon: <WebsiteSVG />
      },
      {
        link: companyInfo?.linkedin,
        isMail: false,
        icon: <LinkedinSVG />
      },
      {
        link: companyInfo?.github,
        isMail: false,
        icon: <GithubSVG />
      }
    ],
    [companyInfo]
  )

  const handleFounder = (userId: number) => {
    if (!companyInfo?.founders) {
      return
    }
    return router.push(`/profile/summary?id=${userId}`)
  }

  return (
    <Box sx={{ pt: 40, px: 48, pb: 48 }}>
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

      <Stack direction={'row'} justifyContent="space-between" mt={18}>
        <Box>
          <Grid container spacing={8} rowGap={32}>
            <Grid item xs={9}>
              <Typography variant="body2" color="var(--ps-gray-700)">
                About
              </Typography>
              <Typography variant="body1" mt={6}>
                {companyInfo?.about || 'No description yet'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)">
                Founder
              </Typography>
              <Box mt={6} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {companyInfo?.founders
                  ? companyInfo?.founders?.map((item, index) => {
                      return (
                        <Typography
                          sx={{
                            color: companyInfo?.founders ? 'var(--ps-blue)' : 'var(--ps-gray-900)',
                            '&:hover': {
                              textDecoration: companyInfo?.founders ? 'underline' : 'none',
                              cursor: companyInfo?.founders ? 'pointer' : 'default'
                            }
                          }}
                          key={item.userId}
                          onClick={() => handleFounder(item.userId)}
                        >
                          {item.founderName} {companyInfo?.founders?.length - 1 !== index ? `, ` : ''}
                        </Typography>
                      )
                    })
                  : '-'}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Location
              </Typography>
              <Box>
                {companyInfo?.location && companyInfo?.timezone ? (
                  <Stack direction={'row'} alignItems="center">
                    <Typography variant="body1" mr={6}>
                      {countries.getName(companyInfo?.location, 'en')}
                    </Typography>

                    <Typography variant="body1">(</Typography>
                    <picture>
                      <img src={ClockSVG} alt="clock" />
                    </picture>

                    <Typography variant="body1">
                      {`${new Date().getHours() + Number(companyInfo?.timezone) - userTimezone}:${(
                        Array(2).join('0') + new Date().getMinutes()
                      ).slice(-2)})`}
                    </Typography>
                  </Stack>
                ) : (
                  '-'
                )}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Startup Time
              </Typography>

              <Typography variant="body1">
                {companyInfo?.startupDate ? moment(companyInfo?.startupDate * 1000).format('MMM YYYY') : '-'}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Market type
              </Typography>
              <Typography variant="body1">
                {getLabel(companyInfo?.marketType, 'marketType', optionDatas?.marketTypeOpt) || '-'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Company size
              </Typography>
              <Typography variant="body1">
                {getLabel(companyInfo?.companySize, 'size', optionDatas?.companySizeOpt) || '-'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="var(--ps-gray-700)" mb={6}>
                Main website
              </Typography>
              {companyInfo?.website ? (
                <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  <a
                    target={'_blank'}
                    href={companyInfo?.website}
                    style={{ color: 'var(--ps-blue)', cursor: 'pointer' }}
                    rel="noreferrer"
                  >
                    {companyInfo?.website}
                  </a>
                </Typography>
              ) : (
                <Typography variant="body1">-</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  )
}

export default CompanyProfileOverview
