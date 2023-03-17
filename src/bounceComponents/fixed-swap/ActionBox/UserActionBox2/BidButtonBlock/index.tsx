import { Button } from '@mui/material'
import { UserBidAction } from '../ActionBlock'
import PlaceBidButton from '../PlaceBidButton'
import UpcomingPoolCountdownButton from './UpcomingPoolCountdownButton'
import WrongNetworkAlert from './WrongNetworkAlert'
import BidButtonGroup from './BidButtonGroup'
import GetFundBackAlert from './GetFundBackAlert'
import GoToCheckButton from './GoToCheckButton'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import useIsLimitExceeded from 'bounceHooks/auction/useIsLimitExceeded'
import SwitchNetworkButton from 'bounceComponents/fixed-swap/SwitchNetworkButton'
import { fixToDecimals } from 'utils/number'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { CurrencyAmount } from 'constants/token'

interface BidButtonBlockProps {
  action: UserBidAction
  handleGoToCheck: () => void
  handlePlaceBid: () => void
  isBidding?: boolean
  handleCancelButtonClick: () => void
  bidAmount: string
  poolInfo: FixedSwapPoolProp
}

const BidButtonBlock = ({
  action,
  bidAmount,
  handleGoToCheck,
  handlePlaceBid,
  isBidding,
  poolInfo,
  handleCancelButtonClick
}: BidButtonBlockProps) => {
  const chainConfig = useChainConfigInBackend('id', poolInfo.chainId)
  const { account, chainId } = useActiveWeb3React()
  const isCurrentChainEqualChainOfPool = useMemo(
    () => chainConfig?.ethChainId === chainId,
    [chainConfig?.ethChainId, chainId]
  )

  const slicedBidAmount = useMemo(
    () => (bidAmount ? fixToDecimals(bidAmount, poolInfo.token1.decimals).toString() : ''),
    [bidAmount, poolInfo.token1.decimals]
  )

  const userBalance = useCurrencyBalance(account || undefined, poolInfo.currencyAmount1.currency)
  const currencySlicedBidAmount = useMemo(
    () => CurrencyAmount.fromAmount(poolInfo.currencyAmount1.currency, slicedBidAmount),
    [poolInfo.currencyAmount1.currency, slicedBidAmount]
  )

  const isBalanceInsufficient = useMemo(() => {
    if (!userBalance || !currencySlicedBidAmount) return true
    return userBalance.lessThan(currencySlicedBidAmount)
  }, [currencySlicedBidAmount, userBalance])

  const isLimitExceeded = useIsLimitExceeded(slicedBidAmount, poolInfo)

  if (!isCurrentChainEqualChainOfPool) {
    return (
      <>
        <SwitchNetworkButton targetChain={chainConfig?.ethChainId || 1} />
        <WrongNetworkAlert />
      </>
    )
  }

  if (poolInfo.status === PoolStatus.Upcoming) {
    return <UpcomingPoolCountdownButton openAt={poolInfo.openAt} />
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

  if (isBalanceInsufficient) {
    return (
      <>
        <BidButtonGroup
          withCancelButton={action === 'MORE_BID'}
          stackSx={{ mt: 24 }}
          onCancel={handleCancelButtonClick}
        >
          <Button variant="contained" fullWidth disabled>
            {!currencySlicedBidAmount ? 'Input Amount' : !userBalance ? 'Loading' : 'Insufficient balance'}
          </Button>
        </BidButtonGroup>
        <GetFundBackAlert />
      </>
    )
  }

  if (action === 'GO_TO_CHECK') {
    return (
      <>
        <GoToCheckButton poolInfo={poolInfo} bidAmount={bidAmount} onClick={handleGoToCheck} />
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
            handlePlaceBid()
          }}
          loading={isBidding}
          poolInfo={poolInfo}
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
            poolInfo={poolInfo}
            bidAmount={bidAmount}
            onClick={() => {
              handlePlaceBid()
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
