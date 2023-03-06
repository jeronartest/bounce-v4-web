import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { BasicOverview } from '../edit/overview'
import { SocialList } from '../edit/social'
import BasicContextProvider, {
  ActionType,
  useBasicProfileDispatch,
  useBasicProfileValues
} from 'bounceComponents/profile/components/BasicContextProvider'
import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import Stepper from 'bounceComponents/create-auction-pool/Stepper'
import UploadAvatar from 'bounceComponents/profile/components/UploadAvatar'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import BasicInvestments from 'bounceComponents/profile/BasicInvestments'

const steps = ['1. Profile Picture', '2. Intro', '3. Social profile', '4. Investments']

export enum BasicStep {
  ProfilePicture,
  Intro,
  SocialProfile,
  Investments
}

const ProfileBasic: React.FC = () => {
  const basicProfileValues = useBasicProfileValues()
  const basicProfileDispatch = useBasicProfileDispatch()

  useEffect(() => {
    console.log('provider state', basicProfileValues)
  }, [basicProfileValues])

  const handleSubmitAvatar = (values: any) => {
    basicProfileDispatch({
      type: ActionType.SetProfileAvatar,
      payload: {
        avatar: values?.avatar
      }
    })
  }

  return (
    <RoundedContainer maxWidth="md" sx={{ pt: 22 }}>
      <Box sx={{ px: 22 }}>
        <Stepper steps={steps} valuesState={basicProfileValues} valuesDispatch={basicProfileDispatch} />
      </Box>
      <Box sx={{ p: '50px 96px 48px', width: '100%' }}>
        {basicProfileValues.activeStep === BasicStep.ProfilePicture && (
          <UploadAvatar
            avatar={basicProfileValues?.avatar}
            onSubmit={handleSubmitAvatar}
            cancelLink={'/profile/summary'}
          />
        )}

        {basicProfileValues.activeStep === BasicStep.Intro && (
          <BasicOverview
            basicProfileValues={basicProfileValues}
            firstEdit={true}
            basicProfileDispatch={basicProfileDispatch}
          />
        )}

        {basicProfileValues.activeStep === BasicStep.SocialProfile && (
          <SocialList
            firstEdit={true}
            basicProfileValues={basicProfileValues}
            basicProfileDispatch={basicProfileDispatch}
          />
        )}
        {basicProfileValues.activeStep === BasicStep.Investments && (
          <RootWrap
            title="Investments"
            component={<BasicInvestments basicProfileValues={basicProfileValues} firstEdit={true} />}
          />
        )}
      </Box>
    </RoundedContainer>
  )
}

const ProfileBasicPage: React.FC = () => {
  return (
    <section>
      <BasicContextProvider>
        <ProfileBasic />
      </BasicContextProvider>
    </section>
  )
}

export default ProfileBasicPage
