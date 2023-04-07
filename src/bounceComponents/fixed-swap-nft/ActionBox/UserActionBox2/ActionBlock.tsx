import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import SuccessfullyClaimedAlert from '../../Alerts/SuccessfullyClaimedAlert'
import SuspiciousTips from '../SuspiciousStatisTip'
import BidOrRegret from './BidOrRegret'
import Check from './Check'
import InputRegretAmount from './InputRegretAmount'
import ConfirmRegret from './ConfirmRegret'
import Bid from './Bid'
import ClaimingCountdownButton from './ClaimingCountdownButton'
import ClaimButton from './ClaimButton'
import usePlaceBid from 'bounceHooks/auction/use1155PlaceBid'
import useRegretBid from 'bounceHooks/auction/use1155RegretBid'
import useIsUserJoinedPool from 'bounceHooks/auction/useIsUserJoined1155Pool'
import useIsCurrentChainEqualChainOfPool from 'bounceHooks/auction/useIsCurrentChainEqualChainOfPool'
import { PoolStatus } from '@/api/pool/type'
import useIsUserClaimedPool from 'bounceHooks/auction/useIsUserClaimed1155Pool'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import useUserClaim from 'bounceHooks/auction/use1155UserClaim'
import { fixToDecimals } from '@/utils/web3/number'
import useNftGoApi from 'bounceHooks/auction/useNftInfoByNftGo'

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
        if (moment().unix() > claimAt) {
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

const ActionBlock = () => {
  const { data: poolInfo } = usePoolInfo()
  const nftGoInfo = useNftGoApi(poolInfo.contract, poolInfo.tokenId)

  const isCurrentChainEqualChainOfPool = useIsCurrentChainEqualChainOfPool()
  const isJoined = useIsUserJoinedPool()
  const isUserClaimed = useIsUserClaimedPool()

  const [action, setAction] = useState<UserAction>()
  const [bidAmount, setBidAmount] = useState('')
  const [regretAmount, setRegretAmount] = useState('')
  // don't calculation value here, just calculation (value = bidAmount * ratio) before Swap
  const slicedBidAmount = bidAmount
    ? // ? fixToDecimals(new BigNumber(bidAmount).times(poolInfo.ratio).toString(), poolInfo.token1.decimals).toString()
      new BigNumber(bidAmount).toString()
    : ''
  const slicedRegretAmount = regretAmount ? fixToDecimals(regretAmount, poolInfo.token0.decimals).toString() : ''

  const { run: bid, loading: isBidding } = usePlaceBid({
    onSuccess: () => {
      setAction('BID_OR_REGRET')
    }
  })
  const { run: regret, loading: isRegretting } = useRegretBid({
    onRegretAll: () => {
      console.log('onRegretAll')
      setAction('FIRST_BID')
    },
    onRegretPart: () => {
      console.log('onRegretPart')
      setAction('BID_OR_REGRET')
    }
  })
  const { run: claim, loading: isClaiming } = useUserClaim({
    onSuccess: () => {
      setAction('CLAIMED')
    }
  })

  // console.log('action: ', action)
  // console.log('isJoined: ', isJoined)
  // console.log('isUserClaimed: ', isUserClaimed)

  useEffect(() => {
    if (!isCurrentChainEqualChainOfPool) {
      setAction('GO_TO_CHECK')
      return
    }

    if (typeof isJoined === 'undefined') return

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
          handlePlaceBid={() => {
            bid(slicedBidAmount)
          }}
          isBidding={isBidding}
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
          regretAmount={regretAmount}
          onCancel={() => {
            setAction('BID_OR_REGRET')
          }}
          handleRegret={() => {
            regret(slicedRegretAmount)
          }}
          isRegretting={isRegretting}
        />
      )}

      {action === 'POOL_CLOSED_AND_NOT_JOINED' && <></>}

      {action === 'CLAIMED' && <SuccessfullyClaimedAlert />}

      {action === 'WAIT_FOR_DELAY' && <ClaimingCountdownButton />}

      {action === 'NEED_TO_CLAIM' && (
        <ClaimButton
          onClick={() => {
            claim()
          }}
          loading={isClaiming}
        />
      )}
      {!!nftGoInfo?.data?.suspicious && <SuspiciousTips />}
    </Box>
  )
}

export default ActionBlock
