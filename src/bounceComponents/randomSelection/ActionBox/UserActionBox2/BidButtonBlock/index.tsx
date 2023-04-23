import { Button } from '@mui/material'
import { UserBidAction } from '../ActionBlock'
import PlaceBidButton from '../PlaceBidButton'
import UpcomingPoolCountdownButton from './UpcomingPoolCountdownButton'
import WrongNetworkAlert from './WrongNetworkAlert'
import BidButtonGroup from './BidButtonGroup'
import GetFundBackAlert from './GetFundBackAlert'
import GoToCheckButton from './GoToCheckButton'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import useIsLimitExceeded from 'bounceHooks/auction/useIsRandomSelectionLimitExceeded'
import SwitchNetworkButton from 'bounceComponents/fixed-swap/SwitchNetworkButton'
import { fixToDecimals } from 'utils/number'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Currency, CurrencyAmount } from 'constants/token'
import { ChainId } from 'constants/chain'

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
  const { account, chainId } = useActiveWeb3React()
  const isCurrentChainEqualChainOfPool = useMemo(() => poolInfo.ethChainId === chainId, [poolInfo.ethChainId, chainId])

  const slicedBidAmount = useMemo(
    () => (bidAmount ? fixToDecimals(bidAmount, poolInfo.token1.decimals).toString() : ''),
    [bidAmount, poolInfo.token1.decimals]
  )
  const currencyAmountTotal1 = {
    chainId: ChainId.GÖRLI, // random selection only support GORLI
    address: poolInfo.token1.address,
    decimals: poolInfo.token1.decimals,
    symbol: poolInfo.token1.symbol
  }
  const userBalance = useCurrencyBalance(account || undefined, currencyAmountTotal1 as Currency, ChainId.GÖRLI)
  console.log('userBalance>>>', userBalance)
  const currencySlicedBidAmount = useMemo(() => {
    const currencyAmountTotal = {
      chainId: ChainId.GÖRLI, // random selection only support GORLI
      address: poolInfo.token1.address,
      decimals: poolInfo.token1.decimals,
      symbol: poolInfo.token1.symbol
    }
    return CurrencyAmount.fromAmount(currencyAmountTotal as Currency, slicedBidAmount)
  }, [poolInfo.token1.address, poolInfo.token1.decimals, poolInfo.token1.symbol, slicedBidAmount])

  const isBalanceInsufficient = useMemo(() => {
    if (!userBalance || !currencySlicedBidAmount) return true
    return userBalance.lessThan(currencySlicedBidAmount)
  }, [currencySlicedBidAmount, userBalance])

  // limit when curPlayer === maxPlayere
  const isLimitExceeded = useIsLimitExceeded(poolInfo)

  if (poolInfo.status === PoolStatus.Upcoming) {
    return <UpcomingPoolCountdownButton openAt={poolInfo.openAt} />
  }

  if (!isCurrentChainEqualChainOfPool) {
    return (
      <>
        <SwitchNetworkButton targetChain={poolInfo.ethChainId || 1} />
        <WrongNetworkAlert />
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
          <Button variant="contained" fullWidth disabled>
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
            {!userBalance ? 'Loading' : 'Insufficient balance'}
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
            action={action}
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
