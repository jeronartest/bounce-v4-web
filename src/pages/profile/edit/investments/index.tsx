import React from 'react'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import EditLayout, { profileTabsList } from 'bounceComponents/company/EditLayout'
import BasicInvestments from 'bounceComponents/profile/BasicInvestments'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const CompanyInvestmentsEdit: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.profile.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={profileTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Investments" required component={<BasicInvestments />} />
      </EditLayout>
    </section>
  )
}

export default CompanyInvestmentsEdit
