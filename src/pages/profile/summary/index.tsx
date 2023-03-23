import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import ProfileOverviewLayout from 'bounceComponents/profile/ProfileOverviewLayout'
import PersonalOverview from 'bounceComponents/profile/components/PersonalOverview'

import ProfileInvestments from 'bounceComponents/profile/ProfileInvestments'
import ProfileExperience from 'bounceComponents/profile/ProfileExperience'
import ProfileEducation from 'bounceComponents/profile/ProfileEducation'
import { getUserInfo } from 'api/user'
import { IProfileUserInfo } from 'api/user/type'
import Activitie from 'bounceComponents/profile/components/SummaryActivities'
import { useQueryParams } from 'hooks/useQueryParams'
import { useUserInfo } from 'state/users/hooks'

const ProfileSummary: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const { userInfo, userId } = useUserInfo()
  const { id } = useQueryParams()

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
  }, [id, userId, userInfo])

  return (
    <ProfileOverviewLayout extraLink={<></>}>
      {personalInfo && (
        <Box sx={{ mt: 40, pb: 48 }}>
          <PersonalOverview personalInfo={personalInfo} />
          <Activitie personalInfoId={personalInfo?.id} />
          <ProfileInvestments personalInfoId={personalInfo?.id} />
          <ProfileExperience personalInfoId={personalInfo?.id} />
          <ProfileEducation personalInfoId={personalInfo?.id} />
        </Box>
      )}
    </ProfileOverviewLayout>
  )
}

export default ProfileSummary
