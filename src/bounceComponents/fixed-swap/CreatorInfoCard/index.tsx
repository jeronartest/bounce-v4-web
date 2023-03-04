import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getCompanyInfo } from 'api/company'
import { getUserInfo } from 'api/user'
import { USER_TYPE } from 'api/user/type'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import { CreatorUserInfo } from 'api/pool/type'
import { ReactComponent as TwitterSVG } from 'assets/imgs/auction/twitter.svg'
import { ReactComponent as InstagramSVG } from 'assets/imgs/auction/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'assets/imgs/auction/website.svg'
import { ReactComponent as LinkedinSVG } from 'assets/imgs/auction/linkedin.svg'
import { ReactComponent as GithubSVG } from 'assets/imgs/auction/github.svg'
import { ReactComponent as EmailSVG } from 'assets/imgs/auction/email.svg'
import Tooltip from 'bounceComponents/common/Tooltip'
import { RootState } from '@/store'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'

interface ICreatorInfoCardProps {
  creatorUserInfo: CreatorUserInfo
}

const SocialMediaButton = ({ children, href }: { children?: ReactNode; href: string }) => {
  return (
    <IconButton href={href} target="_blank" sx={{ border: '1px solid rgba(0, 0, 0, 0.27)', width: 38, height: 38 }}>
      {children}
    </IconButton>
  )
}

const CreatorInfoCard: React.FC<ICreatorInfoCardProps> = ({ creatorUserInfo }) => {
  const { token } = useSelector((state: RootState) => state.user)

  const [userInfo, setUserInfo] = useState(null)
  const router = useRouter()
  useEffect(() => {
    const getInfo = async () => {
      const res =
        creatorUserInfo?.userType === USER_TYPE.USER
          ? await getUserInfo({ userId: creatorUserInfo?.userId })
          : await getCompanyInfo({ userId: creatorUserInfo?.userId })
      setUserInfo(res.data)
    }
    if (creatorUserInfo) {
      getInfo()
    }
  }, [creatorUserInfo])

  const handleUser = () => {
    if (userInfo?.userType === USER_TYPE.USER) {
      return router.push(`/profile/summary?id=${userInfo?.id}`)
    }
    return router.push(`/company/summary?id=${userInfo?.companyId}`)
  }

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 20,
        width: 275,
        flexShrink: 0,
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 28,
        px: 24
      }}
    >
      <Avatar
        sx={{ width: 120, height: 120, cursor: 'pointer' }}
        src={userInfo?.avatar?.fileUrl || DefaultAvatarSVG}
        onClick={handleUser}
      />

      <Stack direction={'row'} alignItems="center" spacing={8} mt={24}>
        <Typography
          variant="h4"
          sx={{ '&:hover': { cursor: 'pointer', textDecoration: 'underline' } }}
          onClick={handleUser}
        >
          {userInfo?.fullName || userInfo?.companyName}
        </Typography>
        <VerifiedIcon isVerify={userInfo?.isVerify} />
      </Stack>
      <Tooltip title={userInfo?.description || userInfo?.briefIntro}>
        <Typography
          variant="body1"
          sx={{
            mt: 10,
            color: 'var(--ps-gray-700)',
            wordBreak: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkitLineClamp': '3',
            '-webkitBoxOrient': 'vertical'
          }}
        >
          {userInfo?.description || userInfo?.briefIntro}
        </Typography>
      </Tooltip>

      <Stack spacing={8} direction="row" sx={{ mt: 24 }}>
        {userInfo?.contactEmail && token ? (
          <SocialMediaButton href={`mailto:${userInfo?.contactEmail}`}>
            <EmailSVG />
          </SocialMediaButton>
        ) : null}

        {userInfo?.twitter && (
          <SocialMediaButton href={userInfo.twitter}>
            <TwitterSVG />
          </SocialMediaButton>
        )}
        {userInfo?.instagram && (
          <SocialMediaButton href={userInfo.instagram}>
            <InstagramSVG />
          </SocialMediaButton>
        )}
        {userInfo?.website && (
          <SocialMediaButton href={userInfo.website}>
            <WebsiteSVG />
          </SocialMediaButton>
        )}
        {userInfo?.linkedin && (
          <SocialMediaButton href={userInfo.linkedin}>
            <LinkedinSVG />
          </SocialMediaButton>
        )}
        {userInfo?.github && (
          <SocialMediaButton href={userInfo.github}>
            <GithubSVG />
          </SocialMediaButton>
        )}
      </Stack>
    </Box>
  )
}

export default CreatorInfoCard
