import React from 'react'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import ResumeExperience from 'bounceComponents/profile/ResumeExperience'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const ResumeExperienceEdit: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.profile.portfolio}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={resumeTabsList} title="Edit portfolio" goBack={goBack}>
        <RootWrap title="Experience" required component={<ResumeExperience />} />
      </EditLayout>
    </section>
  )
}

export default ResumeExperienceEdit
