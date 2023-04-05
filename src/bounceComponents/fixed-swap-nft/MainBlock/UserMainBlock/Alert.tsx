import React from 'react'

import PayAttentionAlert from '../../Alerts/PayAttentionAlert'
import ClaimYourTokenAlert from '../../Alerts/ClaimYourTokenAlert'
import AuctionClosedAlert from '../../Alerts/AuctionClosedAlert'
import NotEligibleAlert from '../../Alerts/NotEligibleAlert'
import { PoolStatus } from '@/api/pool/type'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
import useIsUserInWhitelist from '@/hooks/auction/useIsUserInWhitelist'
import useIsUserJoinedPool from '@/hooks/auction/useIsUserJoined1155Pool'

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
