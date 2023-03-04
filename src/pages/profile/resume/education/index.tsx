import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import RootWrap from '@/components/company/CompanyTeam/components/RootWrap'
import EditLayout, { resumeTabsList } from '@/components/company/EditLayout'
import ResumeEducation from '@/components/profile/ResumeEducation'
import { RootState } from '@/store'

const ResumeEducationEdit: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/profile/portfolio?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Portfolio | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <EditLayout tabsList={resumeTabsList} title="Edit portfolio" goBack={goBack}>
        <RootWrap title="Education" required component={<ResumeEducation />} />
      </EditLayout>
    </section>
  )
}

export default ResumeEducationEdit
