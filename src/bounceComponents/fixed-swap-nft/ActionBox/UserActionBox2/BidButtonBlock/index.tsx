import React from 'react'
import { Button } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { UserBidAction } from '../ActionBlock'
import PlaceBidButton from '../PlaceBidButton'
import UpcomingPoolCountdownButton from './UpcomingPoolCountdownButton'
import WrongNetworkAlert from './WrongNetworkAlert'
import BidButtonGroup from './BidButtonGroup'
import GetFundBackAlert from './GetFundBackAlert'
import GoToCheckButton from './GoToCheckButton'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import useIsCurrentChainEqualChainOfPool from 'bounceHooks/auction/useIsCurrentChainEqualChainOfPool'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { PoolStatus } from '@/api/pool/type'
import useIsLimitExceeded from 'bounceHooks/auction/useIsLimit1155Exceeded'
import useIsBalanceInsufficient from 'bounceHooks/auction/useIs1155BalanceInsufficient'
import SwitchNetworkButton from 'bounceComponents/fixed-swap/SwitchNetworkButton'
import { fixToDecimals } from '@/utils/web3/number'

interface BidButtonBlockProps {
  action: UserBidAction
  handleGoToCheck: () => void
  handlePlaceBid: (bidAmount: string) => void
  isBidding?: boolean
  handleCancelButtonClick: () => void
  bidAmount: string
}

const BidButtonBlock = ({
  action,
  bidAmount,
  handleGoToCheck,
  handlePlaceBid,
  isBidding,
  handleCancelButtonClick
}: BidButtonBlockProps) => {
  const { data: poolInfo } = usePoolInfo()
  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)
  const isCurrentChainEqualChainOfPool = useIsCurrentChainEqualChainOfPool()

  const slicedBidAmount = bidAmount
    ? fixToDecimals(new BigNumber(bidAmount).times(poolInfo.ratio).toString(), poolInfo.token1.decimals).toString()
    : ''

  const isBalanceInsufficient = useIsBalanceInsufficient(slicedBidAmount)
  const isLimitExceeded = useIsLimitExceeded(slicedBidAmount)

  if (!isCurrentChainEqualChainOfPool) {
    return (
      <>
        <SwitchNetworkButton targetChain={chainConfig.ethChainId} />
        <WrongNetworkAlert />
      </>
    )
  }

  if (poolInfo.status === PoolStatus.Upcoming) {
    return <UpcomingPoolCountdownButton openAt={poolInfo.openAt} />
  }

  if (isBalanceInsufficient) {
    return (
      <>
        <BidButtonGroup
          withCancelButton={action === 'MORE_BID'}
          stackSx={{ mt: 24 }}
          onCancel={handleCancelButtonClick}
        >
          <Button variant="contained" fullWidth disabled>
            Insufficient balance
          </Button>
        </BidButtonGroup>
        <GetFundBackAlert />
      </>
    )
  }

  if (isLimitExceeded) {
    return (
      <>
        <BidButtonGroup
          withCancelButton={action === 'MORE_BID'}
          stackSx={{ mt: 24 }}
          onCancel={handleCancelButtonClick}
        >
          <Button variant="contained" fullWidth sx={{ mt: 24 }} disabled>
            Limit Exceeded
          </Button>
        </BidButtonGroup>
        <GetFundBackAlert />
      </>
    )
  }

  if (action === 'GO_TO_CHECK') {
    return (
      <>
        <GoToCheckButton bidAmount={bidAmount} onClick={handleGoToCheck} />
        <GetFundBackAlert />
      </>
    )
  }

  if (action === 'FIRST_BID') {
    return (
      <>
        <PlaceBidButton
          sx={{ mt: 24 }}
          bidAmount={bidAmount}
          onClick={() => {
            handlePlaceBid(bidAmount)
          }}
          loading={isBidding}
        />
        <GetFundBackAlert />
      </>
    )
  }

  if (action === 'MORE_BID') {
    return (
      <>
        <BidButtonGroup
          withCancelButton={action === 'MORE_BID'}
          stackSx={{ mt: 24 }}
          onCancel={handleCancelButtonClick}
        >
          <PlaceBidButton
            bidAmount={bidAmount}
            onClick={() => {
              handlePlaceBid(bidAmount)
            }}
            loading={isBidding}
          />
        </BidButtonGroup>
        <GetFundBackAlert />
      </>
    )
  }

  return null
}

export default BidButtonBlock
