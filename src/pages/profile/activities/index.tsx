import React from 'react'

import { Box } from '@mui/material'
import ProfileOverviewLayout from '@/components/profile/ProfileOverviewLayout'
import Activties from '@/components/profile/components/Activties'
import { UserType } from '@/api/market/type'

const ProfileActivities: React.FC = () => {
  return (
    <ProfileOverviewLayout>
      <Box sx={{ mt: 40, pb: 48 }}>
        <Activties type={UserType.Profile} />
      </Box>
    </ProfileOverviewLayout>
  )
}

export default ProfileActivities
