import React from 'react'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import ResumeEducation from 'bounceComponents/profile/ResumeEducation'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const ResumeEducationEdit: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.profile.portfolio}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={resumeTabsList} title="Edit portfolio" goBack={goBack}>
        <RootWrap title="Education" required component={<ResumeEducation />} />
      </EditLayout>
    </section>
  )
}

export default ResumeEducationEdit
