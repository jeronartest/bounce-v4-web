import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { Box, Container, Stack, Typography, Skeleton, IconButton } from '@mui/material'
import styles from './styles'
import { IProfileUserInfo } from 'api/user/type'
import { ITabsListProps } from 'bounceComponents/profile/ProfileLayout'
import ProfileAvatar from 'bounceComponents/profile/ProfileAvatar'

import { getLabelById } from 'utils'
import { getUserInfo } from 'api/user'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useUserInfo } from 'state/users/hooks'
import { Link } from 'react-router-dom'
import { useQueryParams } from 'hooks/useQueryParams'
import { routes } from 'constants/routes'

import { ReactComponent as TwitterSVG } from 'assets/imgs/auction/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/auction/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/auction/website.svg'
import { ReactComponent as LinkedinSVG } from 'assets/imgs/auction/linkedin.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/auction/github.svg'
import { ReactComponent as EmailSVG } from 'assets/imgs/auction/email.svg'
import ComingSoon from 'pages/ComingSoon'

import TokenAuction from './TokenAuction'

const SocialMediaButton = ({ children, href }: { children?: ReactNode; href: string }) => {
  return (
    <IconButton href={href} target="_blank" sx={{ border: '1px solid rgba(0, 0, 0, 0.27)', width: 38, height: 38 }}>
      {children}
    </IconButton>
  )
}

// interface IProfileOverviewLayout {
//   children?: React.ReactNode
// }

const ProfileHomeLayout: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const { userInfo, userId } = useUserInfo()
  const optionDatas = useOptionDatas()
  const { type } = useQueryParams()
  const { id } = useQueryParams()
  const isLoginUser = useMemo(() => {
    return Number(userId) === Number(id)
  }, [userId, id])

  useEffect(() => {
    const getInfo = async () => {
      const res = await getUserInfo({ userId: Number(id) })
      setPersonalInfo(res.data)
    }
    if (!id || Number(id) === Number(userId)) {
      setPersonalInfo(userInfo)
    } else {
      getInfo()
    }
  }, [id, isLoginUser, userId, userInfo])

  const tabsList: (ITabsListProps & { components: JSX.Element })[] = useMemo(
    () => [
      {
        labelKey: 'Token & NFT Auction',
        label: 'Token & NFT Auction',
        href: '',
        components: personalInfo ? <TokenAuction userInfo={personalInfo} /> : <></>
      },
      {
        labelKey: 'Real World Collectibles Auction',
        label: 'Real World Collectibles Auction',
        href: 'realWorld',
        components: <ComingSoon />
      },
      {
        labelKey: 'Ads Auction',
        label: 'Ads Auction',
        href: 'ads',
        components: <ComingSoon />
      }
    ],
    [personalInfo]
  )

  const hasActive = (path: string | undefined) => {
    if (!path && !type) return true
    return path === type
  }

  const currentTypeRender = useMemo(() => {
    return tabsList.find(({ href }) => href === (type || ''))?.components || null
  }, [tabsList, type])

  return (
    <>
      <Container maxWidth="xl" sx={{ position: 'relative', mb: 80, mt: 80 }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Container maxWidth="lg" sx={styles.contain}>
            <Stack direction="row" sx={{ padding: '40px 48px 0px 36px', minHeight: 138 }}>
              <Box sx={{ position: 'relative', width: '192px' }}>
                {!personalInfo?.avatar ? (
                  <Skeleton
                    variant="circular"
                    width={180}
                    height={180}
                    sx={{ position: 'absolute', top: '-80px', background: 'var(--ps-gray-50)' }}
                  />
                ) : (
                  <ProfileAvatar src={personalInfo?.avatar?.fileThumbnailUrl || personalInfo?.avatar?.fileUrl} />
                )}
                {personalInfo?.isVerify && (
                  <VerifiedIcon
                    isVerify={personalInfo.isVerify}
                    width={42}
                    height={42}
                    showVerify={personalInfo?.id === userId}
                    sx={{ position: 'absolute', right: -28, bottom: 0 }}
                  />
                )}
              </Box>
              <Box sx={{ width: '100%', ml: 48 }}>
                <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                  {!personalInfo?.fullName && !personalInfo?.fullNameId ? (
                    <Skeleton variant="rectangular" width={280} height={46} sx={{ background: 'var(--ps-gray-50)' }} />
                  ) : (
                    <Stack direction={'row'} alignItems="center">
                      <Typography variant="h1" fontWeight={500}>
                        {personalInfo?.fullName}
                      </Typography>
                      <Typography variant="body1" color="rgba(23, 23, 23, 0.7)" ml={10} sx={{ fontSize: 20 }}>
                        {personalInfo?.fullNameId && `#${personalInfo?.fullNameId}`}
                      </Typography>
                    </Stack>
                  )}
                  <Stack spacing={8} direction="row">
                    {personalInfo?.contactEmail ? (
                      <SocialMediaButton href={`mailto:${personalInfo?.contactEmail}`}>
                        <EmailSVG />
                      </SocialMediaButton>
                    ) : null}
                    {personalInfo?.twitter && (
                      <SocialMediaButton href={personalInfo.twitter}>
                        <TwitterSVG />
                      </SocialMediaButton>
                    )}
                    {personalInfo?.instagram && (
                      <SocialMediaButton href={personalInfo.instagram}>
                        <InstagramSVG />
                      </SocialMediaButton>
                    )}
                    {personalInfo?.website && (
                      <SocialMediaButton href={personalInfo.website}>
                        <WebsiteSVG />
                      </SocialMediaButton>
                    )}
                    {personalInfo?.linkedin && (
                      <SocialMediaButton href={personalInfo.linkedin}>
                        <LinkedinSVG />
                      </SocialMediaButton>
                    )}
                    {personalInfo?.github && (
                      <SocialMediaButton href={personalInfo.github}>
                        <GithubSVG />
                      </SocialMediaButton>
                    )}
                  </Stack>
                </Stack>

                <Stack direction={'row'} alignItems="center" spacing={12} mt={6}>
                  {personalInfo?.publicRole?.map(item => {
                    const label = getLabelById(item, 'role', optionDatas?.publicRoleOpt)
                    return (
                      <Box key={item} sx={{ padding: '7px 12px', background: 'var(--ps-gray-50)', borderRadius: 16 }}>
                        {label}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            </Stack>
            <Box pl={48} mt={20}>
              <Typography color={'var(--ps-gray-700)'}>About</Typography>
              <Typography maxWidth={'60%'}>
                {personalInfo?.description || 'There is nothing for the time being'}
              </Typography>
            </Box>
            <Stack direction={'row'} justifyContent="space-between" sx={styles.tabsBox}>
              <Stack direction="row" spacing={36} alignItems="center">
                {tabsList?.map(item => {
                  return (
                    <Typography
                      variant="h4"
                      key={item.labelKey}
                      sx={{ ...styles.menu, ...(hasActive(item?.href) ? styles.menuActive : ({} as any)) }}
                    >
                      <Link replace to={`${routes.profile.summary}?id=${id}&type=${item.href}`}>
                        {item.label}
                      </Link>
                    </Typography>
                  )
                })}
              </Stack>
            </Stack>

            <Box sx={{ background: '#FFFFFF', borderRadius: 20 }}>{currentTypeRender}</Box>
          </Container>
        </Box>
      </Container>
    </>
  )
}

export default ProfileHomeLayout
