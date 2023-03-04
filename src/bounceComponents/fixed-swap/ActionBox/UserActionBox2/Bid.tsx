import React from 'react'
import { Box, Typography } from '@mui/material'
import Balance from './Balance'
import BidAmountInput from './BidAmountInput'
import BidButtonBlock from './BidButtonBlock'
import BidAmountLimit from './BidAmountLimit'
import { UserBidAction } from './ActionBlock'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import { checkIfAllocationLimitExist } from '@/utils/auction'

interface BidProps {
  action: UserBidAction
  bidAmount: string
  setBidAmount: (value: string) => void
  handleGoToCheck: () => void
  handleCancelButtonClick: () => void
  handlePlaceBid: (bidAmount: string) => void
  isBidding?: boolean
}

const Bid = ({
  action,
  bidAmount,
  setBidAmount,
  handleGoToCheck,
  handleCancelButtonClick,
  handlePlaceBid,
  isBidding
}: BidProps) => {
  const { data: poolInfo } = usePoolInfo()
  const isAllocationLimitExist = checkIfAllocationLimitExist(poolInfo.maxAmount1PerWallet)

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Your Bid Amount</Typography>
        <Balance />
      </Box>

      <BidAmountInput bidAmount={bidAmount} setBidAmount={setBidAmount} />

      {isAllocationLimitExist && <BidAmountLimit />}

      <BidButtonBlock
        action={action}
        bidAmount={bidAmount}
        handlePlaceBid={handlePlaceBid}
        isBidding={isBidding}
        handleGoToCheck={handleGoToCheck}
        handleCancelButtonClick={handleCancelButtonClick}
      />
    </>
  )
}

export default Bid
