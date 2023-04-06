import { useRequest } from 'ahooks'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { hide, show } from '@ebay/nice-modal-react'
import { parseUnits } from '@ethersproject/units'

import { BigNumber } from 'bignumber.js'
import { ContractReceipt, ContractTransaction } from 'ethers'
import { useFixedSwapNftContract, useErc20Contract } from '@/hooks/web3/useContractHooks/useContract'
import { swapCall } from '@/utils/web3/contractCalls/erc1155'
// import { approveErc1155TokenAllowance, isApprovedForAllErc1155Token } from '@/hooks/web3/useContractHooks/useErc1155'
import { getFixedSwapNftContractAddress } from '@/utils/web3/contract'

import { PoolType } from '@/api/pool/type'
import { getUserWhitelistProof } from '@/api/user'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { NATIVE_TOEN_ADDRESS } from '@/constants/auction'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import { showRequestConfirmDialog, showWaitingTxDialog, showRequestApprovalDialog } from '@/utils/auction'
import { formatNumber } from '@/utils/web3/number'
import { allowanceCall, approveCall } from '@/utils/web3/contractCalls/erc20'

const usePlaceBid = (options?: { onSuccess?: (data: ContractReceipt) => void }) => {
  const { address: account, isConnected } = useAccount()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  // const isNotInWhitelist = useIsNotInWhitelist()

  const isToken1Native = poolInfo.token1.address === NATIVE_TOEN_ADDRESS

  const fixedSwapNftContract = useFixedSwapNftContract()
  const erc20Contract = useErc20Contract(poolInfo.token1.address)

  // const erc1155Contract = useErc1155Contract(poolInfo.token0.address)
  // TODO: collect poolId, chainId into a context
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)
  const fixedSwapNftContractAddress = getFixedSwapNftContractAddress(chainConfigInBackend.ethChainId)

  const request = useRequest(
    async (bidAmount: string) => {
      // TODO: set decimal places of bid amount to token decimals
      const parsedBidAmount = bidAmount
        ? parseUnits(new BigNumber(bidAmount).times(poolInfo.ratio).toString(), poolInfo.token1.decimals).toString()
        : undefined

      // Generate proof
      let proofArr = []

      if (poolInfo.enableWhiteList) {
        const {
          data: { proof: rawProofStr }
        } = await getUserWhitelistProof({
          address: account,
          category: PoolType.fixedSwapNft,
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
        const allowance = await allowanceCall(erc20Contract, account, fixedSwapNftContractAddress)

        if (allowance.lt(parsedBidAmount)) {
          showRequestApprovalDialog()
          const approvalReceipt = await approveCall(erc20Contract, fixedSwapNftContractAddress, parsedBidAmount)
          if (!approvalReceipt) {
            return Promise.reject(new Error('Failed to approve'))
          }
        }
      }
      // Swap
      showRequestConfirmDialog()
      let tx: ContractTransaction

      if (poolInfo.token1.address === NATIVE_TOEN_ADDRESS) {
        tx = await swapCall(
          fixedSwapNftContract,
          Number(poolId),
          BigNumber(bidAmount).toString(),
          proofArr,
          parsedBidAmount
        )
      } else {
        tx = await swapCall(fixedSwapNftContract, Number(poolId), BigNumber(bidAmount).toString(), proofArr)
      }

      showWaitingTxDialog()

      return tx.wait(1)
    },
    {
      manual: true,
      ready:
        // !!fixedSwapNftContract && (isToken1Native || !!erc1155Contract) && !!chainConfigInBackend?.id && isConnected,
        !!fixedSwapNftContract && isToken1Native && !!chainConfigInBackend?.id && isConnected,
      onSuccess: (data, params) => {
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully bid ${formatNumber(new BigNumber(params[0]), {
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
