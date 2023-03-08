import React from 'react'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyInvestments from 'bounceComponents/company/CompanyInvestments'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const CompanyInvestmentsEdit: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.company.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Investments" component={<CompanyInvestments />} />
      </EditLayout>
    </section>
  )
}

export default CompanyInvestmentsEdit
