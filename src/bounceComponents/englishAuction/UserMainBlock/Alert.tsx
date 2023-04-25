import { EnglishAuctionNFTPoolProp, PoolStatus, PoolType } from 'api/pool/type'
import AuctionClosedAlert from 'bounceComponents/fixed-swap/Alerts/AuctionClosedAlert'
import ClaimYourTokenAlert from 'bounceComponents/fixed-swap/Alerts/ClaimYourTokenAlert'
import NotEligibleAlert from 'bounceComponents/fixed-swap/Alerts/NotEligibleAlert'
import NotStartedAlert from 'bounceComponents/fixed-swap/Alerts/NotStartedAlert'
import PayAttentionAlert from 'bounceComponents/fixed-swap/Alerts/PayAttentionAlert'
import useIsUserInWhitelist from 'bounceHooks/auction/useIsUserInWhitelist'
import { useIsUserJoined1155Pool } from 'bounceHooks/auction/useIsUserJoinedPool'

const Alert = ({ poolInfo }: { poolInfo: EnglishAuctionNFTPoolProp }) => {
  const { data: isUserInWhitelist, loading: isCheckingWhitelist } = useIsUserInWhitelist(
    poolInfo,
    PoolType.ENGLISH_AUCTION_NFT
  )
  const isUserJoinedPool = useIsUserJoined1155Pool(poolInfo)

  if (isCheckingWhitelist) {
    return null
  }

  if (typeof isUserInWhitelist !== 'undefined' && !isUserInWhitelist) {
    return <NotEligibleAlert />
  }

  if (poolInfo.status === PoolStatus.Upcoming) return <NotStartedAlert />

  if (poolInfo.status === PoolStatus.Live) {
    return <PayAttentionAlert />
  }

  if ((poolInfo.status === PoolStatus.Closed || poolInfo.status === PoolStatus.Cancelled) && !isUserJoinedPool) {
    return <AuctionClosedAlert />
  }

  if (poolInfo.status === PoolStatus.Closed && poolInfo.participant.swappedAmount0 && !poolInfo.participant.claimed) {
    return <ClaimYourTokenAlert />
  }

  return null
}

export default Alert
