import React from 'react'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyInvestors from 'bounceComponents/company/CompanyInvestors'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/users/hooks'

const CompanyInvestorsEdit: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useUserInfo()
  const goBack = () => {
    navigate(`${routes.company.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Investors" component={<CompanyInvestors />} />
      </EditLayout>
    </section>
  )
}

export default CompanyInvestorsEdit
