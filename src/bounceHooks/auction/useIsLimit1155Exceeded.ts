/* eslint-disable prettier/prettier */
import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
// import { getUserSwappedAmount1, getUserSwappedUnits1 } from '@/utils/auction'
import { getUserSwappedUnits1 } from '@/utils/auction'

// const useUserSwappedAmount1Units = () => {
//   const { data: poolInfo } = usePoolInfo()

//   const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

//   return getUserSwappedUnits1(
//     getUserSwappedAmount1(
//       poolWithParticipantInfo?.participant.swappedAmount0,
//       poolInfo.token0.decimals,
//       poolInfo.token1.decimals,
//       poolInfo.ratio,
//     ),
//     poolInfo.token1.decimals,
//   )
// }

const useToken1AllocationUnits = () => {
    const { data: poolInfo } = usePoolInfo()

    const hasBidLimit = new BigNumber(poolInfo.maxAmount1PerWallet).gt(0)

    return hasBidLimit ? new BigNumber(poolInfo.maxAmount1PerWallet) : new BigNumber(poolInfo.amountTotal1)
}

const useIsLimitExceeded = (bidAmount: string) => {
    const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()
    const userSwappedAmount1Units = new BigNumber(poolWithParticipantInfo?.participant.swappedAmount0)
    const token1AllocationUnits = useToken1AllocationUnits()
    const bidAmountUnits = new BigNumber(bidAmount)

    const isBidAmountGtLeftAllocationToken1 = bidAmountUnits.gt(token1AllocationUnits)

    const isUserSwappedAmount1GteToken1Allocation = userSwappedAmount1Units.gte(token1AllocationUnits)

    // console.log('isBidAmountGtLeftAllocationToken1: ', isBidAmountGtLeftAllocationToken1)
    // console.log('isUserSwappedAmount1GteLeftAllocationToken1: ', isUserSwappedAmount1GteToken1Allocation)

    return useMemo(
        () => isBidAmountGtLeftAllocationToken1 || isUserSwappedAmount1GteToken1Allocation,
        [isBidAmountGtLeftAllocationToken1, isUserSwappedAmount1GteToken1Allocation],
    )
}

export default useIsLimitExceeded
