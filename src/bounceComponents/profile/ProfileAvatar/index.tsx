import { Avatar, Box } from '@mui/material'
import React from 'react'
import styles from './styles'
import { ReactComponent as DefaultAvatar } from '@/assets/imgs/profile/default_avatar.svg'
import VerifiedIcon from '@/components/common/VerifiedIcon'

interface IProfileAvatar {
  src: string
}
const ProfileAvatar: React.FC<IProfileAvatar> = ({ src }) => {
  return (
    <Box sx={styles.avatarBox}>
      {src ? (
        <Avatar src={src} sx={styles.avatar} />
      ) : (
        <Box sx={styles.defaultAva}>
          <DefaultAvatar />
        </Box>
      )}
    </Box>
  )
}

export default ProfileAvatar
