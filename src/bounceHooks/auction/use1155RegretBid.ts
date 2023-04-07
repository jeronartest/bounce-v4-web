import { useRequest } from 'ahooks'
import { ContractReceipt } from 'ethers'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { hide, show } from '@ebay/nice-modal-react'
import { parseUnits } from 'ethers/lib/utils.js'

import { useFixedSwapNftContract } from 'bounceHooks/web3/useContractHooks/useContract'
import { reverseCall } from '@/utils/web3/contractCalls/erc1155'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import usePoolWithParticipantInfo from 'bounceHooks/auction/use1155PoolWithParticipantInfo'
import { showRequestConfirmDialog, showWaitingTxDialog } from '@/utils/auction'

const useRegretBid = (options?: {
  onRegretPart?: (data: ContractReceipt) => void
  onRegretAll?: (data: ContractReceipt) => void
}) => {
  const { isConnected } = useAccount()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const fixedSwapContract = useFixedSwapNftContract()

  // TODO: collect poolId, chainId into a context
  const router = useRouter()
  const { poolId } = router.query

  const request = useRequest(
    async (token0AmountToRegret: string) => {
      const token0UnitsToRegret = parseUnits(token0AmountToRegret, poolInfo.token0.decimals)
      const tx = await reverseCall(fixedSwapContract, Number(poolId), token0UnitsToRegret)

      showWaitingTxDialog()

      return tx.wait(1)
    },
    {
      manual: true,
      debounceWait: 500,
      ready: !!fixedSwapContract && isConnected,
      onBefore: () => {
        showRequestConfirmDialog()
      },
      onSuccess: (data, params) => {
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully refunded.`
        })

        const token0UnitsToRegret = parseUnits(params[0], poolInfo.token0.decimals)

        if (token0UnitsToRegret.lt(poolWithParticipantInfo?.participant.swappedAmount0)) {
          options?.onRegretPart?.(data)
        } else {
          options?.onRegretAll?.(data)
        }
      },
      onError: (error: Error & { reason: string }) => {
        console.log('regret error: ', error)

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

export default useRegretBid
