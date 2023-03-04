import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import VerifiedIcon from '../VerifiedIcon'
import DefaultAvatarSVG from '@/assets/imgs/profile/yellow_avatar.svg'
import { VerifyStatus } from '@/api/profile/type'

export type IAuctionHolderProps = {
  avatar: string
  name: string
  description: string
  href: string
  isVerify: VerifyStatus
}

export const AuctionHolder: React.FC<IAuctionHolderProps> = ({ avatar, description, name, href, isVerify }) => {
  const history = useRouter()
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={12}
      onClick={(ev) => {
        ev.preventDefault()
        history.push(href)
      }}
      sx={{
        px: 10,
        py: 6,
        mt: 20,
        bgcolor: 'var(--ps-gray-50)',
        borderRadius: 12,
        '&:hover': { bgcolor: 'var(--ps-gray-200)' },
      }}
    >
      <Avatar src={avatar || DefaultAvatarSVG} sx={{ width: 52, height: 52 }} />
      <Stack spacing={4}>
        <Stack direction={'row'} alignItems="center" spacing={8}>
          <Typography variant="h6">{name}</Typography>
          <VerifiedIcon isVerify={isVerify} />
        </Stack>

        <Typography variant="body2" color="var(--ps-gray-700)">
          {description}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default AuctionHolder
