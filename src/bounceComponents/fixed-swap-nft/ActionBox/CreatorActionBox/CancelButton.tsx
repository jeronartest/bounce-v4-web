import React from 'react'
import { LoadingButton } from '@mui/lab'
import { useRequest } from 'ahooks'
import { hide, show } from '@ebay/nice-modal-react'

import { creatorClaimCall } from '@/utils/web3/contractCalls/erc1155'
import { useFixedSwapNftContract } from '@/hooks/web3/useContractHooks/useContract'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'

const CancelButton = (): JSX.Element => {
  const contract = useFixedSwapNftContract()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  const { run: cancelPool, loading: isCancellingPool } = useRequest(
    async () => {
      const tx = await creatorClaimCall(contract, poolInfo?.poolId)

      show(DialogConfirmation, {
        title: 'Bounce waiting for transaction settlement',
        subTitle:
          'Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.'
      })

      return tx.wait(1)
    },
    {
      manual: true,
      ready: !!contract && !!poolInfo,
      onBefore: () => {
        show(DialogConfirmation, {
          title: 'Bounce requests wallet interaction',
          subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.'
        })
      },
      onSuccess: () => {
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully cancelled the pool and claimed your tokens`
        })
      },
      onError: (error: Error & { reason: string }) => {
        hide(DialogConfirmation)
        console.log('error: ', error)
        show<any, DialogTipsProps>(id, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: cancelPool
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      }
    }
  )

  return (
    <LoadingButton variant="outlined" fullWidth sx={{ mt: 24, mb: 12 }} loading={isCancellingPool} onClick={cancelPool}>
      Cancel & Claim tokens
    </LoadingButton>
  )
}

export default CancelButton
