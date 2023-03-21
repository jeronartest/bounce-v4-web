import { Box } from '@mui/material'

import { useEffect } from 'react'

import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import { CreationStep, TokenType } from 'bounceComponents/create-auction-pool/types'
import ValuesProvider, {
  ActionType,
  useValuesDispatch,
  useValuesState
} from 'bounceComponents/create-auction-pool/ValuesProvider'
import Stepper from 'bounceComponents/create-auction-pool/Stepper'
import { isSupportedAuctionType } from 'constants/auction'
import { useQueryParams } from 'hooks/useQueryParams'
import { useActiveWeb3React } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import Erc20Pool from './Erc20Pool'

const steps = ['1. Token Information', '2. Auction Parameters', '3. Advanced Settings']

const CreateAuctionPool = () => {
  const valuesState = useValuesState()
  const valuesDispatch = useValuesDispatch()

  const { tokenType } = useQueryParams()

  useEffect(() => {
    valuesDispatch?.({
      type: ActionType.SetTokenType,
      payload: { tokenType: tokenType || TokenType.ERC20 }
    })
  }, [tokenType, valuesDispatch])

  return (
    <>
      <RoundedContainer maxWidth="md" sx={{ pt: 22 }}>
        {valuesState.activeStep !== CreationStep.CREATION_CONFIRMATION && (
          <Box sx={{ px: 22 }}>
            <Stepper steps={steps} valuesState={valuesState} valuesDispatch={valuesDispatch} />
          </Box>
        )}
        {valuesState.tokenType === TokenType.ERC20 ? <Erc20Pool /> : null}
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
