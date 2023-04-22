import { Box, Typography } from '@mui/material'
import BidAmountInput from './BidAmountInput'
import BidButtonBlock from './BidButtonBlock'
import BidAmountLimit from './BidAmountLimit'
import { UserBidAction } from './ActionBlock'
import { checkIfAllocationLimitExist } from 'utils/auction'
import { FixedSwapPoolProp } from 'api/pool/type'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'

interface BidProps {
  action: UserBidAction
  bidAmount: string
  setBidAmount: (value: string) => void
  handleGoToCheck: () => void
  handleCancelButtonClick: () => void
  handlePlaceBid: () => void
  isBidding?: boolean
  poolInfo: FixedSwapPoolProp
}

const Bid = ({
  action,
  bidAmount,
  setBidAmount,
  handleGoToCheck,
  handleCancelButtonClick,
  handlePlaceBid,
  isBidding,
  poolInfo
}: BidProps) => {
  const isAllocationLimitExist = checkIfAllocationLimitExist(poolInfo.maxAmount1PerWallet)
  const { account } = useActiveWeb3React()
  const userToken1Balance = useCurrencyBalance(account || undefined, poolInfo.currencyAmountTotal1.currency)

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Your Bid Amount</Typography>
        <Typography>
          Balance: {userToken1Balance?.toSignificant()} {poolInfo.token1.symbol}
        </Typography>
      </Box>

      <BidAmountInput poolInfo={poolInfo} bidAmount={bidAmount} setBidAmount={setBidAmount} />

      {isAllocationLimitExist && <BidAmountLimit poolInfo={poolInfo} />}

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
