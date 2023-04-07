import React from 'react'
import { useRequest } from 'ahooks'
import { BigNumber, BigNumberish, ContractReceipt, VoidSigner } from 'ethers'
import { useAccount } from 'wagmi'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'

import { hide, show } from '@ebay/nice-modal-react'
import { parseUnits } from 'ethers/lib/utils.js'
import { useFixedSwapContract } from 'bounceHooks/web3/useContractHooks/useContract'
import { reverseCall } from '@/utils/web3/contractCalls/fixedSwap'
import { PoolStatus } from '@/api/pool/type'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import usePoolWithParticipantInfo from 'bounceHooks/auction/use1155PoolWithParticipantInfo'

export interface RefundButtonProps {
  token0AmountToRefund?: BigNumber
  disabled?: boolean
  onRefundPart: (data: ContractReceipt) => void
  onRefundAll: (data: ContractReceipt) => void
}

const RefundButton = ({
  token0AmountToRefund,
  disabled,
  onRefundPart,
  onRefundAll
}: RefundButtonProps): JSX.Element => {
  const { isConnected } = useAccount()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const fixedSwapContract = useFixedSwapContract()

  // TODO: collect poolId, chainId into a context
  const router = useRouter()
  const { poolId } = router.query

  const { run: refund, loading: isRefunding } = useRequest(
    async () => {
      const tx = await reverseCall(fixedSwapContract, Number(poolId), token0AmountToRefund)

      show(DialogConfirmation, {
        title: 'Bounce waiting for transaction settlement',
        subTitle:
          'Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.'
      })

      return tx.wait(1)
    },
    {
      manual: true,
      debounceWait: 500,
      ready: !!fixedSwapContract && isConnected && !!token0AmountToRefund,
      onBefore: () => {
        show(DialogConfirmation, {
          title: 'Bounce requests wallet interaction',
          subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.'
        })
      },
      onSuccess: data => {
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully refunded.`
        })
        const regretBalanceUnits = parseUnits(
          poolWithParticipantInfo.participant.swappedAmount0,
          poolWithParticipantInfo.token0.decimals
        )

        if (token0AmountToRefund.lt(regretBalanceUnits)) {
          onRefundPart?.(data)
        } else {
          onRefundAll?.(data)
        }
      },
      onError: (error: Error & { reason: string }) => {
        console.log('swap error: ', error)

        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: refund
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      }
    }
  )

  return (
    <LoadingButton
      variant="contained"
      fullWidth
      sx={{ mt: 24, mb: 12, px: 40 }}
      loading={isRefunding}
      disabled={disabled || poolInfo.status !== PoolStatus.Live}
      onClick={refund}
    >
      Confirm
    </LoadingButton>
  )
}

export default RefundButton
