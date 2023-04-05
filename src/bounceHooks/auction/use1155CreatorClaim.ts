import { useRequest } from 'ahooks'
import { hide, show } from '@ebay/nice-modal-react'

import { creatorClaimCall } from '@/utils/web3/contractCalls/erc1155'
import { useFixedSwapNftContract } from '@/hooks/web3/useContractHooks/useContract'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import DialogConfirmation from '@/components/common/DialogConfirmation'
import DialogTips from '@/components/common/DialogTips'
import { formatNumber } from '@/utils/web3/number'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
import { showRequestConfirmDialog, showWaitingTxDialog } from '@/utils/auction'

const useCreatorClaim = () => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const contract = useFixedSwapNftContract()

  const hasToken0ToClaim = poolWithParticipantInfo?.currentTotal0 && poolWithParticipantInfo.currentTotal0 !== '0'
  const token0ToClaim = formatNumber(poolWithParticipantInfo?.currentTotal0, {
    unit: poolInfo.token0.decimals,
  })
  const token1ToClaim = formatNumber(poolWithParticipantInfo?.currentTotal1, {
    unit: poolInfo.token1.decimals,
  })
  const token1ToClaimText = `${token1ToClaim} ${poolInfo.token1.symbol}`
  const token0ToClaimText = hasToken0ToClaim ? ` and ${token0ToClaim} ${poolInfo.token0.symbol}` : ''
  const successDialogContent = `You have successfully claimed ${token1ToClaimText}${token0ToClaimText}`

  const request = useRequest(
    async () => {
      const tx = await creatorClaimCall(contract, poolInfo?.poolId)

      showWaitingTxDialog()

      return tx.wait(1)
    },
    {
      manual: true,
      ready: !!contract && !!poolInfo,
      onBefore: () => {
        showRequestConfirmDialog()
      },
      onSuccess: () => {
        show(DialogTips, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: successDialogContent,
        })
      },
      onError: (error: Error & { reason: string }) => {
        console.log('creator claim error: ', error)

        show(DialogTips, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: request.refresh,
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      },
    },
  )

  return request
}

export default useCreatorClaim
