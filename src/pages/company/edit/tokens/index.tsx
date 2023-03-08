import React from 'react'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyTokens from 'bounceComponents/company/CompanyTokens'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/users/hooks'

const CompanyTokensEdit: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useUserInfo()
  const goBack = () => {
    navigate(`${routes.company.summary}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Tokens" component={<CompanyTokens />} />
      </EditLayout>
    </section>
  )
}

export default CompanyTokensEdit
