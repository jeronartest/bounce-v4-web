import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import ProfileOverviewLayout from 'bounceComponents/profile/ProfileOverviewLayout'
import PersonalOverview from 'bounceComponents/profile/components/PersonalOverview'

import ProfileInvestments from 'bounceComponents/profile/ProfileInvestments'
import ProfileExperience from 'bounceComponents/profile/ProfileExperience'
import ProfileEducation from 'bounceComponents/profile/ProfileEducation'
import { getUserInfo } from 'api/user'
import { IProfileUserInfo } from 'api/user/type'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import Activitie from 'bounceComponents/profile/components/SummaryActivities'
import { useQueryParams } from 'hooks/useQueryParams'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const ProfileSummary: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const { userInfo, userId } = useUserInfo()
  const navigate = useNavigate()
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

  const extraLinkBtn = () => {
    if (!id || Number(id) === Number(userId)) {
      return (
        <Button
          onClick={() => {
            if (userInfo?.avatar?.fileUrl) {
              navigate(routes.profile.edit.overview)
            } else {
              navigate(routes.profile.basic)
            }
          }}
          size="small"
          sx={{
            background: 'none',
            '&:hover': {
              background: 'none',
              color: 'var(--ps-blue)'
            }
          }}
        >
          <EditSVG style={{ marginRight: 10 }} />
          Edit summary
        </Button>
      )
    }
    return <></>
  }

  return (
    <ProfileOverviewLayout extraLink={extraLinkBtn()}>
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
