import React from 'react'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyTeam from 'bounceComponents/company/CompanyTeam'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const CompanyTeamEdit: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useUserInfo()
  const goBack = () => {
    navigate(`${routes.company.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Team" required component={<CompanyTeam />} />
      </EditLayout>
    </section>
  )
}

export default CompanyTeamEdit
