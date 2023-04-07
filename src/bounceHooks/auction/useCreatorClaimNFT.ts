import { useCallback } from 'react'
import { calculateGasMargin } from 'utils'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { useTransactionAdder, useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { useFixedSwapNftContract } from 'hooks/useContract'

export function useCreatorClaimNFT(poolId: number | string, name: string) {
  const { account } = useActiveWeb3React()
  const fixedSwapNftContract = useFixedSwapNftContract()
  const addTransaction = useTransactionAdder()
  const funcName = 'creatorClaim'

  const submitted = useUserHasSubmittedRecords(account || undefined, funcName, poolId + '_NFT')

  const run = useCallback(async (): Promise<{
    hash: string
    transactionReceipt: Promise<TransactionReceipt>
  }> => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!fixedSwapNftContract) {
      return Promise.reject('no contract')
    }

    const args = [poolId]

    const estimatedGas = await fixedSwapNftContract.estimateGas[funcName](...args).catch((error: Error) => {
      console.debug('Failed to claim for creator', error)
      throw error
    })
    return fixedSwapNftContract[funcName](...args, {
      gasLimit: calculateGasMargin(estimatedGas)
    }).then((response: TransactionResponse) => {
      addTransaction(response, {
        summary: `Creator claim assets for ${name}`,
        userSubmitted: {
          account,
          action: funcName,
          key: poolId + '_NFT'
        }
      })
    })
  }, [account, addTransaction, fixedSwapNftContract, name, poolId])

  return { submitted, run }
}
