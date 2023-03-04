import React from 'react'

import PayAttentionAlert from '../../Alerts/PayAttentionAlert'
import ClaimYourTokenAlert from '../../Alerts/ClaimYourTokenAlert'
import AuctionClosedAlert from '../../Alerts/AuctionClosedAlert'
import NotEligibleAlert from '../../Alerts/NotEligibleAlert'
import { PoolStatus } from 'api/pool/type'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import usePoolWithParticipantInfo from 'bounceHooks/auction/usePoolWithParticipantInfo'
import useIsUserInWhitelist from 'bounceHooks/auction/useIsUserInWhitelist'
import useIsUserJoinedPool from 'bounceHooks/auction/useIsUserJoinedPool'

const Alert = () => {
  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const { data: isUserInWhitelist, loading: isCheckingWhitelist } = useIsUserInWhitelist()
  const isUserJoinedPool = useIsUserJoinedPool()

  if (isCheckingWhitelist) {
    return null
  }

  if (typeof isUserInWhitelist !== 'undefined' && !isUserInWhitelist) {
    return <NotEligibleAlert />
  }

  if (poolInfo.status === PoolStatus.Live || poolInfo.status === PoolStatus.Upcoming) {
    return <PayAttentionAlert />
  }

  if ((poolInfo.status === PoolStatus.Closed || poolInfo.status === PoolStatus.Cancelled) && !isUserJoinedPool) {
    return <AuctionClosedAlert />
  }

  if (
    poolInfo.status === PoolStatus.Closed &&
    poolWithParticipantInfo?.participant.swappedAmount0 &&
    !poolWithParticipantInfo?.participant.claimed
  ) {
    return <ClaimYourTokenAlert />
  }

  return null
}

export default Alert
