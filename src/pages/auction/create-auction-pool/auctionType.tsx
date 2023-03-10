import { Box, Stack } from '@mui/material'

import { useEffect } from 'react'

import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import TokenInformationForm from 'bounceComponents/create-auction-pool/TokenInforationForm'
import AuctionParametersForm from 'bounceComponents/create-auction-pool/AuctionParametersForm'
import { CreationStep } from 'bounceComponents/create-auction-pool/types'
// import AdvancedSettingsForm from 'bounceComponents/create-auction-pool/AdvancedSettingsForm'
// import CreationConfirmation from 'bounceComponents/create-auction-pool/CreationConfirmation'
import ValuesProvider, { useValuesDispatch, useValuesState } from 'bounceComponents/create-auction-pool/ValuesProvider'
import Stepper from 'bounceComponents/create-auction-pool/Stepper'
import { isSupportedAuctionType } from 'constants/auction'
import { useQueryParams } from 'hooks/useQueryParams'
import { useActiveWeb3React } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const steps = ['1. Token Information', '2. Auction Parameters', '3. Advanced Settings']

const CreateAuctionPool = () => {
  const valuesState = useValuesState()
  const valuesDispatch = useValuesDispatch()

  // useEffect(() => {
  //   console.log('>>>> ValuesState: ', valuesState)
  // }, [valuesState])

  return (
    <>
      <RoundedContainer maxWidth="md" sx={{ pt: 22 }}>
        {valuesState.activeStep !== CreationStep.CREATION_CONFIRMATION && (
          <Box sx={{ px: 22 }}>
            <Stepper steps={steps} valuesState={valuesState} valuesDispatch={valuesDispatch} />
          </Box>
        )}

        <Stack alignItems="center">
          {valuesState.activeStep !== CreationStep.CREATION_CONFIRMATION ? (
            <Box sx={{ pb: 48, maxWidth: 660, width: '100%' }}>
              {valuesState.activeStep === CreationStep.TOKEN_INFORMATION && <TokenInformationForm />}

              {valuesState.activeStep === CreationStep.AUCTION_PARAMETERS && <AuctionParametersForm />}

              {/* {valuesState.activeStep === CreationStep.ADVANCED_SETTINGS && <AdvancedSettingsForm />} */}
            </Box>
          ) : (
            <></>
            // <CreationConfirmation />
          )}
        </Stack>
      </RoundedContainer>
    </>
  )
}

// TODO: Disabe pool creation is account is not binded
// TODO: notice user that start time is earlier current moment

const CreateAuctionPoolPage = () => {
  const { redirect } = useQueryParams()
  const navigate = useNavigate()

  const { account } = useActiveWeb3React()

  const { auctionType } = useQueryParams()

  useEffect(() => {
    if (!account || typeof auctionType !== 'string' || !isSupportedAuctionType(auctionType)) {
      navigate(`${routes.auction.createAuctionPool}?redirect=${redirect}`)
    }
  }, [account, auctionType, navigate, redirect])

  return (
    <ValuesProvider>
      <CreateAuctionPool />
    </ValuesProvider>
  )
}

export default CreateAuctionPoolPage
