import React from 'react'
import PoolInfoItem from '../../PoolInfoItem'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
interface IBidAmountLimitProps {
  bidAmount?: string
}
const BidAmountLimit = (props: IBidAmountLimitProps) => {
  const { bidAmount } = props
  const { data: poolInfo } = usePoolInfo()
  const formatedMMaxAmount1PerWallet = poolInfo.maxAmount1PerWallet ? poolInfo.maxAmount1PerWallet : '-'

  return (
    <PoolInfoItem
      title="Bid amount limit"
      sx={{
        mt: 8,
        color:
          bidAmount && formatedMMaxAmount1PerWallet && bidAmount > formatedMMaxAmount1PerWallet ? '#F53030' : 'black',
      }}
    >
      {bidAmount || 0} NFT / {formatedMMaxAmount1PerWallet}&nbsp; NFT
    </PoolInfoItem>
  )
}

export default BidAmountLimit
