import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import SuccessfullyClaimedAlert from '../../Alerts/SuccessfullyClaimedAlert'
import BidOrRegret from './BidOrRegret'
import Check from './Check'
import InputRegretAmount from './InputRegretAmount'
import ConfirmRegret from './ConfirmRegret'
import Bid from './Bid'
import ClaimingCountdownButton from './ClaimingCountdownButton'
import ClaimButton from './ClaimButton'
import usePlaceBid from 'bounceHooks/auction/usePlaceBid'
import useRegretBid from 'bounceHooks/auction/useRegretBid'
import useIsUserJoinedPool from 'bounceHooks/auction/useIsUserJoinedPool'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import useUserClaim from 'bounceHooks/auction/useUserClaim'
import { fixToDecimals, formatNumber } from 'utils/number'
import { useActiveWeb3React } from 'hooks'
import { hideDialogConfirmation, showRequestConfirmDialog, showWaitingTxDialog } from 'utils/auction'
import { CurrencyAmount } from 'constants/token'
import { show } from '@ebay/nice-modal-react'
import DialogTips from 'bounceComponents/common/DialogTips'
import { BigNumber } from 'bignumber.js'

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
  const [bidAmount, setBidAmount] = useState('')
  const [regretAmount, setRegretAmount] = useState('')

  const slicedBidAmount = bidAmount ? fixToDecimals(bidAmount, poolInfo.token1.decimals).toString() : ''
  const slicedRegretAmount = regretAmount ? fixToDecimals(regretAmount, poolInfo.token0.decimals).toString() : ''

  const currencyBidAmount = CurrencyAmount.fromAmount(poolInfo.currencyAmountTotal1.currency, slicedBidAmount)
  const currencyRegretAmount = CurrencyAmount.fromAmount(poolInfo.currencyAmountTotal1.currency, slicedRegretAmount)

  const { run: bid, submitted: placeBidSubmitted } = usePlaceBid(poolInfo)

  const toBid = useCallback(async () => {
    if (!currencyBidAmount) return
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
        content: typeof err === 'string' ? err : err?.error?.message || err?.message || 'Something went wrong',
        onAgain: toBid
      })
    }
  }, [bid, currencyBidAmount, poolInfo.ratio, poolInfo.token0.symbol])

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
        })
        transactionReceipt.then(curReceipt => {
          resolve(curReceipt)
        })
      })
      ret
        .then(() => {
          hideDialogConfirmation()
          setAction('BID_OR_REGRET')
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
      hideDialogConfirmation()
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: typeof err === 'string' ? err : err?.error?.message || err?.message || 'Something went wrong',
        onAgain: toRegret
      })
    }
  }, [currencyRegretAmount, regret])

  const { run: claim, submitted: claimBidSubmitted } = useUserClaim(poolInfo)

  const toClaim = useCallback(async () => {
    if (!currencyRegretAmount) return
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
      hideDialogConfirmation()
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: typeof err === 'string' ? err : err?.error?.message || err?.message || 'Something went wrong',
        onAgain: toClaim
      })
    }
  }, [claim, currencyRegretAmount, poolInfo.participant.currencySwappedAmount0, poolInfo.token0.symbol])

  useEffect(() => {
    if (!isCurrentChainEqualChainOfPool) {
      setAction('GO_TO_CHECK')
      return
    }

    setAction(getInitialAction(isJoined, isUserClaimed, poolInfo?.status, poolInfo?.claimAt))
  }, [isCurrentChainEqualChainOfPool, isJoined, isUserClaimed, poolInfo?.claimAt, poolInfo?.status])

  useEffect(() => {
    if (action === 'BID_OR_REGRET') {
      setBidAmount('')
      setRegretAmount('')
    }
    if (action === 'INPUT_REGRET_AMOUNT' || action === 'CONFIRM_REGRET') {
      setBidAmount('')
    }
    if (action === 'GO_TO_CHECK' || action === 'CHECK' || action === 'FIRST_BID' || action === 'MORE_BID') {
      setRegretAmount('')
    }
  }, [action])

  return (
    <Box sx={{ mt: 32 }}>
      {(action === 'GO_TO_CHECK' || action === 'FIRST_BID' || action === 'MORE_BID') && (
        <Bid
          action={action}
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
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
      )}

      {action === 'CHECK' && (
        <Check
          onConfirm={() => {
            setAction(isJoined ? 'MORE_BID' : 'FIRST_BID')
          }}
        />
      )}

      {action === 'BID_OR_REGRET' && (
        <BidOrRegret
          onBidButtonClick={() => {
            setAction('MORE_BID')
          }}
          onRegretButtonClick={() => {
            setAction('INPUT_REGRET_AMOUNT')
          }}
        />
      )}

      {action === 'INPUT_REGRET_AMOUNT' && (
        <InputRegretAmount
          regretAmount={regretAmount}
          slicedRegretAmount={slicedRegretAmount}
          setRegretAmount={setRegretAmount}
          poolInfo={poolInfo}
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

      {action === 'POOL_CLOSED_AND_NOT_JOINED' && <></>}

      {action === 'CLAIMED' && <SuccessfullyClaimedAlert />}

      {action === 'WAIT_FOR_DELAY' && <ClaimingCountdownButton poolInfo={poolInfo} getPoolInfo={getPoolInfo} />}

      {action === 'NEED_TO_CLAIM' && <ClaimButton onClick={toClaim} loading={claimBidSubmitted.submitted} />}
    </Box>
  )
}

export default ActionBlock
