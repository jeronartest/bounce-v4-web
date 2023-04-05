import { Avatar, Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import AuctionDescription from './AuctionDescription'
import AuctionFiles from './AuctionFiles'
import { getCompanyInfo } from '@/api/company'
import { getUserInfo } from '@/api/user'
import { USER_TYPE } from '@/api/user/type'
import { CreatorUserInfo } from '@/api/pool/type'
import Tooltip from '@/components/common/Tooltip'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import SocialMediaButtonGroup from '@/components/common/SocialMediaButtonGroup'

import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import VerifiedIcon from '@/components/common/VerifiedIcon'

interface ICreatorInfoCardProps {
  poolId: number
  creatorUserInfo: CreatorUserInfo
}

const useIsCurrentAddressCreatedThisPool = () => {
  const { data: poolInfo } = usePoolInfo()

  const { address: account } = useAccount()

  return useMemo(() => {
    return !!poolInfo && !!account && poolInfo.creator === account
  }, [account, poolInfo])
}

const CreatorInfoCard: React.FC<ICreatorInfoCardProps> = ({ poolId, creatorUserInfo }) => {
  const [userInfo, setUserInfo] = useState(null)
  const router = useRouter()

  const isCurrentUserCreatedThisPool = useIsCurrentAddressCreatedThisPool()

  const handleUser = () => {
    if (userInfo?.userType === USER_TYPE.USER) {
      return router.push(`/profile/summary?id=${userInfo?.id}`)
    }
    return router.push(`/company/summary?id=${userInfo?.companyId}`)
  }

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
      <Tooltip title={userInfo?.description || userInfo?.briefIntro || 'No description yet'}>
        <Typography
          variant="body1"
          sx={{
            mt: 10,
            color: 'var(--ps-gray-700)',
            wordBreak: 'break-word',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical'
          }}
        >
          {userInfo?.description || userInfo?.briefIntro || 'No description yet'}
        </Typography>
      </Tooltip>

      <SocialMediaButtonGroup
        href={{
          email: userInfo?.email,
          twitter: userInfo?.twitter,
          instagram: userInfo?.instagram,
          website: userInfo?.website,
          linkedin: userInfo?.linkedin,
          github: userInfo?.github
        }}
      />

      <AuctionDescription poolId={poolId} canEdit={isCurrentUserCreatedThisPool} />

      <AuctionFiles
        poolId={poolId}
        canDownloadFile={!isCurrentUserCreatedThisPool}
        canDeleteFile={isCurrentUserCreatedThisPool}
        canAddFile={isCurrentUserCreatedThisPool}
      />
    </Box>
  )
}

export default CreatorInfoCard
