import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Button } from '@mui/material'
import ProfileOverviewLayout from '@/components/profile/ProfileOverviewLayout'
import PersonalOverview from '@/components/profile/components/PersonalOverview'

import ProfileInvestments from '@/components/profile/ProfileInvestments'
import ProfileExperience from '@/components/profile/ProfileExperience'
import ProfileEducation from '@/components/profile/ProfileEducation'
import { getUserInfo } from '@/api/user'
import { RootState } from '@/store'
import { IProfileUserInfo } from '@/api/user/type'
import { ReactComponent as EditSVG } from '@/assets/imgs/companies/edit.svg'
import Activitie from '@/components/profile/components/SummaryActivities'

const ProfileSummary: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const { userInfo, userId } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const { id } = router.query

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
              router.push('/profile/edit/overview')
            } else {
              router.push('/profile/basic')
            }
          }}
          size="small"
          sx={{
            background: 'none',
            '&:hover': {
              background: 'none',
              color: 'var(--ps-blue)',
            },
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
      <Box sx={{ mt: 40, pb: 48 }}>
        <PersonalOverview personalInfo={personalInfo} />
        <Activitie personalInfoId={personalInfo?.id} />
        <ProfileInvestments personalInfoId={personalInfo?.id} />
        <ProfileExperience personalInfoId={personalInfo?.id} />
        <ProfileEducation personalInfoId={personalInfo?.id} />
      </Box>
    </ProfileOverviewLayout>
  )
}

export default ProfileSummary
