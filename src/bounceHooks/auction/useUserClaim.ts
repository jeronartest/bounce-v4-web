import { useRequest } from 'ahooks'
import { useAccount } from 'wagmi'
import { hide, show } from '@ebay/nice-modal-react'

import { ContractReceipt } from 'ethers'
import useIsUserJoinedPool from './useIsUserJoinedPool'
import { userClaimCall } from '@/utils/web3/contractCalls/fixedSwap'
import { useFixedSwapContract } from 'bounceHooks/web3/useContractHooks/useContract'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import { formatNumber } from '@/utils/web3/number'
import usePoolWithParticipantInfo from 'bounceHooks/auction/usePoolWithParticipantInfo'
import { showRequestConfirmDialog, showWaitingTxDialog } from '@/utils/auction'

const useUserClaim = (options?: { onSuccess?: (data: ContractReceipt) => void }) => {
  const { isConnected } = useAccount()

  const fixedSwapContract = useFixedSwapContract()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const isJoined = useIsUserJoinedPool()

  const request = useRequest(
    async () => {
      const tx = await userClaimCall(fixedSwapContract, poolInfo?.poolId)

      showWaitingTxDialog()

      return tx.wait(1)
    },
    {
      manual: true,
      ready: !!fixedSwapContract && isConnected && !!poolInfo?.poolId && isJoined,
      onBefore: () => {
        showRequestConfirmDialog()
      },
      onSuccess: data => {
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully claimed ${formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
            unit: poolInfo.token0.decimals
          })} ${poolInfo.token0.symbol}`
        })
        options?.onSuccess?.(data)
      },
      onError: error => {
        show<any, DialogTipsProps>(id, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: request.refresh
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      }
    }
  )

  return request
}

export default useUserClaim
