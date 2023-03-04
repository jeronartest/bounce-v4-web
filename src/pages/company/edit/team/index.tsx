import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import EditLayout, { companyTabsList } from '@/components/company/EditLayout'
import RootWrap from '@/components/company/CompanyTeam/components/RootWrap'
import CompanyTeam from '@/components/company/CompanyTeam'
import { RootState } from '@/store'

const CompanyTeamEdit: React.FC = () => {
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
        <RootWrap title="Team" required component={<CompanyTeam />} />
      </EditLayout>
    </section>
  )
}

export default CompanyTeamEdit
