import { useCountDown, useRequest } from 'ahooks'
import React from 'react'
import { useAccount } from 'wagmi'
import { Box, SxProps, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { hide, show } from '@ebay/nice-modal-react'
import { parseUnits } from '@ethersproject/units'

import { BigNumber } from 'bignumber.js'
import { ContractReceipt, ContractTransaction } from 'ethers'
import { useErc20Contract, useFixedSwapContract } from 'bounceHooks/web3/useContractHooks/useContract'
import { getFixedSwapContractAddress } from '@/utils/web3/contract'
import { swapCall } from '@/utils/web3/contractCalls/fixedSwap'
import { allowanceCall, approveCall } from '@/utils/web3/contractCalls/erc20'
import { PoolStatus, PoolType } from 'api/pool/type'
import { getUserWhitelistProof } from 'api/user'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import { NATIVE_TOEN_ADDRESS } from '@/constants/auction'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import { showRequestApprovalDialog, showRequestConfirmDialog, showWaitingTxDialog } from '@/utils/auction'
import { formatNumber } from '@/utils/web3/number'

const usePlaceBid = (options?: { onSuccess?: (data: ContractReceipt) => void }) => {
  const { address: account, isConnected } = useAccount()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  // const isNotInWhitelist = useIsNotInWhitelist()

  const isToken1Native = poolInfo.token1.address === NATIVE_TOEN_ADDRESS

  const fixedSwapContract = useFixedSwapContract()
  const erc20Contract = useErc20Contract(poolInfo.token1.address)

  // TODO: collect poolId, chainId into a context
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)
  const fixedSwapContractAddress = getFixedSwapContractAddress(chainConfigInBackend.ethChainId)

  const request = useRequest(
    async (bidAmount: string) => {
      // TODO: set decimal places of bid amount to token decimals
      const parsedBidAmount = bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals) : undefined

      // Generate proof
      let proofArr = []

      if (poolInfo.enableWhiteList) {
        const {
          data: { proof: rawProofStr }
        } = await getUserWhitelistProof({
          address: account,
          category: PoolType.FixedSwap,
          chainId: chainConfigInBackend?.id,
          poolId: String(poolId)
        })

        const rawProofJson = JSON.parse(rawProofStr)

        if (Array.isArray(rawProofJson)) {
          proofArr = rawProofJson.map(rawProof => `0x${rawProof}`)
        }
      }

      // Check allowance
      // If token1 is not native and allowance is lower than amount to swap, then approve token.
      if (!isToken1Native) {
        const allowance = await allowanceCall(erc20Contract, account, fixedSwapContractAddress)

        if (allowance.lt(parsedBidAmount)) {
          showRequestApprovalDialog()
          const approvalReceipt = await approveCall(erc20Contract, fixedSwapContractAddress, parsedBidAmount)

          if (!approvalReceipt) {
            return Promise.reject(new Error('Failed to approve'))
          }
        }
      }

      // Swap
      showRequestConfirmDialog()

      let tx: ContractTransaction

      if (poolInfo.token1.address === NATIVE_TOEN_ADDRESS) {
        tx = await swapCall(fixedSwapContract, Number(poolId), parsedBidAmount, proofArr, parsedBidAmount)
      } else {
        tx = await swapCall(fixedSwapContract, Number(poolId), parsedBidAmount, proofArr)
      }

      showWaitingTxDialog()

      return tx.wait(1)
    },
    {
      manual: true,
      ready: !!fixedSwapContract && (isToken1Native || !!erc20Contract) && !!chainConfigInBackend?.id && isConnected,
      onSuccess: (data, params) => {
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully bid ${formatNumber(new BigNumber(params[0]).div(poolInfo.ratio), {
            unit: 0
          })} ${poolInfo.token0.symbol}`
        })
        options?.onSuccess?.(data)
      },
      onError: (error: Error & { reason: string }) => {
        console.log('swap error: ', error)
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

export default usePlaceBid
