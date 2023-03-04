import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import Head from 'next/head'
import { JobOverview } from './job'
import { PreferenceItems } from './preference'
import { ResumeFiles } from './resume'

import RoundedContainer from '@/components/create-auction-pool/RoundedContainer'
import Stepper from '@/components/create-auction-pool/Stepper'
import RootWrap from '@/components/company/CompanyTeam/components/RootWrap'
import ResumeContextProvider, {
  useResumeProfileDispatch,
  useResumeProfileValues,
} from '@/components/profile/components/ResumeContextProvider'
import ResumeExperience from '@/components/profile/ResumeExperience'
import ResumeEducation from '@/components/profile/ResumeEducation'

const steps = ['1. Job Overview', '2. Experience', '3. Education', '4. Preference', '5. Resume']

export enum ResumeStep {
  JobOverview,
  Experience,
  Education,
  Preference,
  Resume,
}

const ProfileResume: React.FC = () => {
  const resumeProfileValues = useResumeProfileValues()
  const resumeProfileDispatch = useResumeProfileDispatch()

  useEffect(() => {
    console.log('provider state', resumeProfileValues)
  }, [resumeProfileValues])

  return (
    <RoundedContainer
      maxWidth="md"
      sx={{
        pt: 22,
      }}
    >
      <Box sx={{ px: 22 }}>
        <Stepper steps={steps} valuesState={resumeProfileValues} valuesDispatch={resumeProfileDispatch} />
      </Box>
      <Box sx={{ p: '50px 96px 48px', width: '100%' }}>
        {resumeProfileValues.activeStep === ResumeStep.JobOverview && (
          <JobOverview
            firstEdit={true}
            resumeProfileValues={resumeProfileValues}
            resumeProfileDispatch={resumeProfileDispatch}
          />
        )}
        {resumeProfileValues.activeStep === ResumeStep.Experience && (
          <RootWrap
            title="Describe your experience"
            required
            component={
              <ResumeExperience
                firstEdit={true}
                resumeProfileValues={resumeProfileValues}
                resumeProfileDispatch={resumeProfileDispatch}
              />
            }
          />
        )}
        {resumeProfileValues.activeStep === ResumeStep.Education && (
          <RootWrap
            title="Describe your education"
            required
            component={
              <ResumeEducation
                firstEdit={true}
                resumeProfileValues={resumeProfileValues}
                resumeProfileDispatch={resumeProfileDispatch}
              />
            }
          />
        )}
        {resumeProfileValues.activeStep === ResumeStep.Preference && (
          <PreferenceItems
            firstEdit={true}
            resumeProfileValues={resumeProfileValues}
            resumeProfileDispatch={resumeProfileDispatch}
          />
        )}
        {resumeProfileValues.activeStep === ResumeStep.Resume && (
          <ResumeFiles firstEdit={true} resumeProfileValues={resumeProfileValues} />
        )}
      </Box>
    </RoundedContainer>
  )
}

const ProfileResumePage: React.FC = () => {
  return (
    <section>
      <Head>
        <title>Edit Portfolio | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>

      <ResumeContextProvider>
        <ProfileResume />
      </ResumeContextProvider>
    </section>
  )
}

export default ProfileResumePage
