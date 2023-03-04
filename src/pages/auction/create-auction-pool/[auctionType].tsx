import { Box, Stack } from '@mui/material'

import React, { useEffect } from 'react'

import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import TokenInformationForm from 'bounceComponents/create-auction-pool/TokenInforationForm'
import AuctionParametersForm from 'bounceComponents/create-auction-pool/AuctionParametersForm'
import { CreationStep } from 'bounceComponents/create-auction-pool/types'
import AdvancedSettingsForm from 'bounceComponents/create-auction-pool/AdvancedSettingsForm'
import CreationConfirmation from 'bounceComponents/create-auction-pool/CreationConfirmation'
import ValuesProvider, { useValuesDispatch, useValuesState } from 'bounceComponents/create-auction-pool/ValuesProvider'
import Stepper from 'bounceComponents/create-auction-pool/Stepper'
import { isSupportedChain } from '@/constants/web3/chains'
import { isSupportedAuctionType } from '@/constants/auction'
import useEagerConnect from 'bounceHooks/web3/useEagerConnect'

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

              {valuesState.activeStep === CreationStep.ADVANCED_SETTINGS && <AdvancedSettingsForm />}
            </Box>
          ) : (
            <CreationConfirmation />
          )}
        </Stack>
      </RoundedContainer>
    </>
  )
}

// TODO: Disabe pool creation is account is not binded
// TODO: notice user that start time is earlier current moment

const CreateAuctionPoolPage = () => {
  useEagerConnect()
  const router = useRouter()
  const { redirect } = router.query

  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const { auctionType } = router.query

  useEffect(() => {
    if (
      !isSupportedChain(chain?.id) ||
      !isConnected ||
      typeof auctionType !== 'string' ||
      !isSupportedAuctionType(auctionType)
    ) {
      router.push(`/auction/create-auction-pool?redirect=${redirect}`)
    }
  }, [auctionType, chain?.id, isConnected, redirect, router])

  return (
    <ValuesProvider>
      <CreateAuctionPool />
    </ValuesProvider>
  )
}

export default CreateAuctionPoolPage
