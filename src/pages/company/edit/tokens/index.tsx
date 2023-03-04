import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import EditLayout, { companyTabsList } from 'bounceComponents/company/EditLayout'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyTokens from 'bounceComponents/company/CompanyTokens'
import { RootState } from '@/store'

const CompanyTokensEdit: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/company/summary?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Summary | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <EditLayout tabsList={companyTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Tokens" component={<CompanyTokens />} />
      </EditLayout>
    </section>
  )
}

export default CompanyTokensEdit
