import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import ProfileOverviewLayout from 'bounceComponents/profile/ProfileOverviewLayout'
import ProfileExperience from 'bounceComponents/profile/ProfileExperience'
import ProfileEducation from 'bounceComponents/profile/ProfileEducation'
import { getUserInfo } from 'api/user'
import { IProfileUserInfo } from 'api/user/type'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import PortfolioBox from 'bounceComponents/profile/components/PortfolioPreference'
import DownloadResume from 'bounceComponents/profile/components/DownloadResume'
import { useQueryParams } from 'hooks/useQueryParams'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const ProfilePortfolio: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const { userInfo, userId } = useUserInfo()
  const { id } = useQueryParams()
  const navigate = useNavigate()

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
            if (userInfo?.primaryRole) {
              navigate(routes.profile.resume.job)
            } else {
              navigate(routes.profile.resume.index)
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
          Edit portfolio
        </Button>
      )
    }
    return <></>
  }

  return (
    <ProfileOverviewLayout extraLink={extraLinkBtn()}>
      <Box sx={{ mt: 40 }}>
        <PortfolioBox personalInfo={personalInfo} />
        <DownloadResume resumes={personalInfo?.resumes} />
        <ProfileExperience personalInfoId={personalInfo?.id} />
        <ProfileEducation personalInfoId={personalInfo?.id} />
      </Box>
    </ProfileOverviewLayout>
  )
}

export default ProfilePortfolio
