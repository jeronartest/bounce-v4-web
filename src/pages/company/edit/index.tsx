import React, { useEffect } from 'react'
import { Box } from '@mui/material'

import { CompanyOverviewEdit } from './overview'
import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import Stepper from 'bounceComponents/create-auction-pool/Stepper'
import CompanyContextProvider, {
  CompanyActionType,
  useCompanyProfileDispatch,
  useCompanyProfileValues
} from 'bounceComponents/company/components/CompanyContextProvider'
import UploadAvatar from 'bounceComponents/profile/components/UploadAvatar'
import RootWrap from 'bounceComponents/company/CompanyTeam/components/RootWrap'
import CompanyTeam from 'bounceComponents/company/CompanyTeam'
import CompanyTokens from 'bounceComponents/company/CompanyTokens'
import CompanyInvestors from 'bounceComponents/company/CompanyInvestors'
import CompanyInvestments from 'bounceComponents/company/CompanyInvestments'

const steps = ['1. Profile Picture', '2. Intro', '3. Team', '4. Tokens', '5. Investors', '6. Investments']

export enum CompanyStep {
  ProfilePicture,
  Intro,
  Team,
  Tokens,
  Investors,
  Investments
}

const CompanyEdit: React.FC = () => {
  const companyProfileValues = useCompanyProfileValues()
  const companyProfileDispatch = useCompanyProfileDispatch()

  useEffect(() => {
    console.log('provider state', companyProfileValues)
  }, [companyProfileValues])

  const handleSubmitAvatar = (values: any) => {
    companyProfileDispatch({
      type: CompanyActionType.SetProfilePicture,
      payload: {
        companyBasicInfo: {
          avatar: values?.avatar
        }
      }
    })
  }

  return (
    <RoundedContainer maxWidth="md" sx={{ pt: 22 }}>
      <Box sx={{ px: 22, '& button': { padding: '10px 0' } }}>
        <Stepper steps={steps} valuesState={companyProfileValues} valuesDispatch={companyProfileDispatch} />
      </Box>
      <Box sx={{ p: '50px 96px 48px', width: '100%' }}>
        {companyProfileValues.activeStep === CompanyStep.ProfilePicture && (
          <UploadAvatar
            avatar={companyProfileValues?.companyBasicInfo?.avatar}
            onSubmit={handleSubmitAvatar}
            cancelLink={'/company/summary'}
          />
        )}
        {companyProfileValues.activeStep === CompanyStep.Intro && (
          <CompanyOverviewEdit
            companyProfileValues={companyProfileValues}
            firstEdit={true}
            companyProfileDispatch={companyProfileDispatch}
          />
        )}
        {companyProfileValues.activeStep === CompanyStep.Team && (
          <RootWrap
            title="Team members"
            required
            component={
              <CompanyTeam
                companyProfileValues={companyProfileValues}
                firstEdit={true}
                companyProfileDispatch={companyProfileDispatch}
              />
            }
          />
        )}
        {companyProfileValues.activeStep === CompanyStep.Tokens && (
          <RootWrap
            title="Add company tokens"
            component={
              <CompanyTokens
                companyProfileValues={companyProfileValues}
                firstEdit={true}
                companyProfileDispatch={companyProfileDispatch}
              />
            }
          />
        )}
        {companyProfileValues.activeStep === CompanyStep.Investors && (
          <RootWrap
            title="Add investors"
            component={
              <CompanyInvestors
                companyProfileValues={companyProfileValues}
                firstEdit={true}
                companyProfileDispatch={companyProfileDispatch}
              />
            }
          />
        )}
        {companyProfileValues.activeStep === CompanyStep.Investments && (
          <RootWrap
            title="Add Investments"
            component={
              <CompanyInvestments
                companyProfileValues={companyProfileValues}
                firstEdit={true}
                companyProfileDispatch={companyProfileDispatch}
              />
            }
          />
        )}
      </Box>
    </RoundedContainer>
  )
}

const CompanyEditPage: React.FC = () => {
  return (
    <section>
      <CompanyContextProvider>
        <CompanyEdit />
      </CompanyContextProvider>
    </section>
  )
}

export default CompanyEditPage
