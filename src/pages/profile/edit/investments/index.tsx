import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import RootWrap from '@/components/company/CompanyTeam/components/RootWrap'
import EditLayout, { profileTabsList } from '@/components/company/EditLayout'
import BasicInvestments from '@/components/profile/BasicInvestments'
import { RootState } from '@/store'

const CompanyInvestmentsEdit: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/profile/summary?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Summary | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>

      <EditLayout tabsList={profileTabsList} title="Edit summary" goBack={goBack}>
        <RootWrap title="Investments" required component={<BasicInvestments />} />
      </EditLayout>
    </section>
  )
}

export default CompanyInvestmentsEdit
