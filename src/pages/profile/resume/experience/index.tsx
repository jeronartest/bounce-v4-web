import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import ResumeExperience from 'bounceComponents/profile/ResumeExperience'
import { RootState } from '@/store'

const ResumeExperienceEdit: React.FC = () => {
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
        <RootWrap title="Experience" required component={<ResumeExperience />} />
      </EditLayout>
    </section>
  )
}

export default ResumeExperienceEdit
