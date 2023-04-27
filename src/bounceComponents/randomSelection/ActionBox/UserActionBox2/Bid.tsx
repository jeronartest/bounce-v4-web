import BidButtonBlock from './BidButtonBlock'
import { UserBidAction } from './ActionBlock'
import { FixedSwapPoolProp } from 'api/pool/type'

interface BidProps {
  action: UserBidAction
  bidAmount: string
  handleGoToCheck: () => void
  handleCancelButtonClick: () => void
  handlePlaceBid: () => void
  isBidding?: boolean
  poolInfo: FixedSwapPoolProp
}

const Bid = ({
  action,
  bidAmount,
  handleGoToCheck,
  handleCancelButtonClick,
  handlePlaceBid,
  isBidding,
  poolInfo
}: BidProps) => {
  return (
    <>
      <BidButtonBlock
        action={action}
        bidAmount={bidAmount}
        handlePlaceBid={handlePlaceBid}
        isBidding={isBidding}
        handleGoToCheck={handleGoToCheck}
        handleCancelButtonClick={handleCancelButtonClick}
        poolInfo={poolInfo}
      />
    </>
  )
}

export default Bid
