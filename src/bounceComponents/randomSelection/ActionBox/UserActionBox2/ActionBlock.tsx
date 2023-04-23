import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import BidOrRegret from './BidOrRegret'
import Check from './Check'
import InputRegretAmount from './InputRegretAmount'
import ConfirmRegret from './ConfirmRegret'
import Bid from './Bid'
import useRandomSelectionPlaceBid from 'bounceHooks/auction/useRandomSelectionPlaceBid'
import useRegretBid from 'bounceHooks/auction/useRandomSelectionRegretBid'
import useIsUserJoinedPool from 'bounceHooks/auction/useIsUserJoinedPool'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import useUserClaim from 'bounceHooks/auction/useRandomSelectionUserClaim'
import { fixToDecimals, formatNumber } from 'utils/number'
import { useActiveWeb3React } from 'hooks'
import { hideDialogConfirmation, showRequestConfirmDialog, showWaitingTxDialog } from 'utils/auction'
import { Currency, CurrencyAmount } from 'constants/token'
import { show } from '@ebay/nice-modal-react'
import DialogTips from 'bounceComponents/common/DialogTips'
import { BigNumber } from 'bignumber.js'
import { ChainId } from 'constants/chain'
import Upcoming from './RandomSelectionStatusCard/Upcoming'
import Closed from './RandomSelectionStatusCard/Closed'
import LiveCard from './RandomSelectionStatusCard/Live'

export type UserAction =
  | 'GO_TO_CHECK'
  | 'CHECK'
  | 'FIRST_BID'
  | 'BID_OR_REGRET'
  | 'INPUT_REGRET_AMOUNT'
  | 'CONFIRM_REGRET'
  | 'MORE_BID'
  | 'POOL_CLOSED_AND_NOT_JOINED'
  | 'NEED_TO_CLAIM'
  | 'CLAIMED'
  | 'WAIT_FOR_DELAY'

const getInitialAction = (
  isJoined?: boolean,
  isClaimed?: boolean,
  poolStatus?: PoolStatus,
  claimAt?: number
): UserAction => {
  // console.log('internal isJoined: ', isJoined)
  // console.log('internal isClaimed: ', isClaimed)
  if (poolStatus === PoolStatus.Upcoming || poolStatus === PoolStatus.Cancelled) {
    return 'GO_TO_CHECK'
  }
  if (poolStatus === PoolStatus.Live) {
    if (isJoined) {
      return 'BID_OR_REGRET'
    } else {
      return 'GO_TO_CHECK'
    }
  }
  if (poolStatus === PoolStatus.Closed) {
    if (isJoined) {
      if (isClaimed) {
        return 'CLAIMED'
      } else {
        if (moment().unix() > (claimAt || 0)) {
          return 'NEED_TO_CLAIM'
        } else {
          return 'WAIT_FOR_DELAY'
        }
      }
    } else {
      return 'POOL_CLOSED_AND_NOT_JOINED'
    }
  }
  return 'GO_TO_CHECK'
}

export type UserBidAction = 'GO_TO_CHECK' | 'FIRST_BID' | 'MORE_BID'

const ActionBlock = ({ poolInfo, getPoolInfo }: { poolInfo: FixedSwapPoolProp; getPoolInfo: () => void }) => {
  const { chainId } = useActiveWeb3React()

  const isCurrentChainEqualChainOfPool = useMemo(() => chainId === poolInfo.ethChainId, [chainId, poolInfo.ethChainId])

  const isJoined = useIsUserJoinedPool(poolInfo)
  const isUserClaimed = useMemo(() => !!poolInfo.participant.claimed, [poolInfo])

  const [action, setAction] = useState<UserAction>()
  const [bidAmount, setBidAmount] = useState(poolInfo.maxAmount1PerWallet || '')
  const [regretAmount, setRegretAmount] = useState(poolInfo.maxAmount1PerWallet || '')
  const slicedBidAmount = bidAmount ? fixToDecimals(bidAmount, poolInfo.token1.decimals).toString() : ''
  const slicedRegretAmount = regretAmount ? fixToDecimals(regretAmount, poolInfo.token1.decimals).toString() : ''
  useEffect(() => {
    setBidAmount(poolInfo.maxAmount1PerWallet)
    setRegretAmount(poolInfo.maxAmount1PerWallet)
  }, [poolInfo])
  const currencyAmountTotal1 = {
    chainId: ChainId.GÖRLI, // random selection only support GORLI
    address: poolInfo.token1.address,
    decimals: poolInfo.token1.decimals,
    symbol: poolInfo.token1.symbol
  }
  const currencyBidAmount = CurrencyAmount.fromAmount(currencyAmountTotal1 as Currency, slicedBidAmount)
  const currencyRegretAmount = CurrencyAmount.fromAmount(currencyAmountTotal1 as Currency, slicedRegretAmount)

  const { run: bid, submitted: placeBidSubmitted } = useRandomSelectionPlaceBid(poolInfo)

  const toBid = useCallback(async () => {
    if (!slicedBidAmount || !currencyBidAmount) return
    showRequestConfirmDialog()
    try {
      const { transactionReceipt } = await bid(currencyBidAmount)
      const ret = new Promise((resolve, rpt) => {
        showWaitingTxDialog(() => {
          hideDialogConfirmation()
          rpt()
        })
        transactionReceipt.then(curReceipt => {
          resolve(curReceipt)
        })
      })
      ret
        .then(() => {
          hideDialogConfirmation()
          // TOTD ?
          setAction('BID_OR_REGRET')
          show(DialogTips, {
            iconType: 'success',
            againBtn: 'Close',
            title: 'Congratulations!',
            content: `You have successfully bid ${formatNumber(
              new BigNumber(currencyBidAmount.toSignificant(64, { groupSeparator: '' })).div(poolInfo.ratio),
              {
                unit: 0
              }
            )} ${poolInfo.token0.symbol}`
          })
        })
        .catch()
    } catch (error) {
      const err: any = error
      hideDialogConfirmation()
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
        onAgain: toBid
      })
    }
  }, [bid, currencyBidAmount, poolInfo.ratio, poolInfo.token0.symbol, slicedBidAmount])

  const { run: regret, submitted: regretBidSubmitted } = useRegretBid(poolInfo)

  const toRegret = useCallback(async () => {
    if (!currencyRegretAmount) return
    showRequestConfirmDialog()
    try {
      const { transactionReceipt } = await regret(currencyRegretAmount)
      const ret = new Promise((resolve, rpt) => {
        showWaitingTxDialog(() => {
          hideDialogConfirmation()
          rpt()
          setAction('INPUT_REGRET_AMOUNT')
          setRegretAmount('')
        })
        transactionReceipt.then(curReceipt => {
          resolve(curReceipt)
        })
      })
      ret
        .then(() => {
          hideDialogConfirmation()
          setRegretAmount('')
          setAction('INPUT_REGRET_AMOUNT')
          show(DialogTips, {
            iconType: 'success',
            againBtn: 'Close',
            title: 'Congratulations!',
            content: `You have successfully refunded.`
          })
        })
        .catch()
    } catch (error) {
      const err: any = error
      console.error(err)
      hideDialogConfirmation()
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
        onAgain: toRegret
      })
    }
  }, [currencyRegretAmount, regret])

  const { run: claim, submitted: claimBidSubmitted } = useUserClaim(poolInfo)

  const toClaim = useCallback(async () => {
    showRequestConfirmDialog()
    try {
      const { transactionReceipt } = await claim()
      const ret = new Promise((resolve, rpt) => {
        showWaitingTxDialog(() => {
          hideDialogConfirmation()
          rpt()
        })
        transactionReceipt.then(curReceipt => {
          resolve(curReceipt)
        })
      })
      ret
        .then(() => {
          hideDialogConfirmation()
          setAction('CLAIMED')
          show(DialogTips, {
            iconType: 'success',
            againBtn: 'Close',
            title: 'Congratulations!',
            content: `You have successfully claimed ${poolInfo.participant.currencySwappedAmount0?.toSignificant()} ${
              poolInfo.token0.symbol
            }`
          })
        })
        .catch()
    } catch (error) {
      const err: any = error
      console.error(err)
      hideDialogConfirmation()
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
        onAgain: toClaim
      })
    }
  }, [claim, poolInfo.participant.currencySwappedAmount0, poolInfo.token0.symbol])

  useEffect(() => {
    if (!isCurrentChainEqualChainOfPool) {
      setAction('GO_TO_CHECK')
      return
    }
    setAction(getInitialAction(isJoined, isUserClaimed, poolInfo?.status, poolInfo?.claimAt))
  }, [isCurrentChainEqualChainOfPool, isJoined, isUserClaimed, poolInfo?.claimAt, poolInfo?.status])

  useEffect(() => {
    if (action === 'BID_OR_REGRET') {
      setRegretAmount('')
    }
    if (action === 'INPUT_REGRET_AMOUNT' || action === 'CONFIRM_REGRET') {
    }
    if (action === 'GO_TO_CHECK' || action === 'CHECK' || action === 'FIRST_BID' || action === 'MORE_BID') {
      setRegretAmount('')
    }
  }, [action])

  return (
    <Box sx={{ mt: 32 }}>
      {(action === 'GO_TO_CHECK' || action === 'FIRST_BID' || action === 'MORE_BID') && (
        <>
          {poolInfo.status === PoolStatus.Upcoming && <Upcoming poolInfo={poolInfo} />}
          {poolInfo.status === PoolStatus.Live && (
            <LiveCard poolInfo={poolInfo} action={action} isJoined={!!isJoined} />
          )}
          {/* Bid component has set disable to button when action is MORE_BID because of the random-selection auction only can bet once */}
          <Bid
            action={action}
            bidAmount={bidAmount}
            handleGoToCheck={() => {
              setAction('CHECK')
            }}
            handleCancelButtonClick={() => {
              setAction('BID_OR_REGRET')
            }}
            handlePlaceBid={toBid}
            poolInfo={poolInfo}
            isBidding={placeBidSubmitted.submitted}
          />
        </>
      )}

      {action === 'CHECK' && (
        <Check
          onConfirm={() => {
            setAction(isJoined ? 'MORE_BID' : 'FIRST_BID')
          }}
        />
      )}

      {action === 'BID_OR_REGRET' && (
        <>
          {poolInfo.status === PoolStatus.Live && (
            <LiveCard poolInfo={poolInfo} action={action} isJoined={!!isJoined} />
          )}
          <BidOrRegret
            onBidButtonClick={() => {
              setAction('MORE_BID')
            }}
            onRegretButtonClick={() => {
              setAction('INPUT_REGRET_AMOUNT')
            }}
          />
        </>
      )}

      {action === 'INPUT_REGRET_AMOUNT' && (
        // random-selection don`t need to input regret amount.just use maxAmount1PerWallet
        <InputRegretAmount
          poolInfo={poolInfo}
          isRegretting={regretBidSubmitted.submitted}
          onCancel={() => {
            setAction('BID_OR_REGRET')
          }}
          onConfirm={() => {
            setAction('CONFIRM_REGRET')
          }}
        />
      )}

      {action === 'CONFIRM_REGRET' && (
        <ConfirmRegret
          poolInfo={poolInfo}
          regretAmount={regretAmount}
          onCancel={() => {
            setAction('BID_OR_REGRET')
          }}
          handleRegret={() => {
            toRegret()
          }}
          isRegretting={regretBidSubmitted.submitted}
        />
      )}

      {(action === 'POOL_CLOSED_AND_NOT_JOINED' ||
        action === 'CLAIMED' ||
        action === 'NEED_TO_CLAIM' ||
        action === 'WAIT_FOR_DELAY') && (
        <>
          <Closed
            poolInfo={poolInfo}
            isJoined={!!isJoined}
            action={action}
            toClaim={toClaim}
            submitted={claimBidSubmitted.submitted}
            getPoolInfo={getPoolInfo}
          />
        </>
      )}
    </Box>
  )
}

export default ActionBlock
