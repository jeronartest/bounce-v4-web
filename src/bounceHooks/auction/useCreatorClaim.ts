import { useCallback } from 'react'
import { calculateGasMargin } from 'utils'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { useTransactionAdder, useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { useFixedSwapERC20Contract } from 'hooks/useContract'

export function useCreatorClaim(poolId: number | string, name: string) {
  const { account } = useActiveWeb3React()
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const addTransaction = useTransactionAdder()

  const submitted = useUserHasSubmittedRecords(account || undefined, 'creatorClaimCall', poolId)

  const run = useCallback(async (): Promise<{
    hash: string
    transactionReceipt: Promise<TransactionReceipt>
  }> => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!fixedSwapERC20Contract) {
      return Promise.reject('no contract')
    }

    const args = [poolId]

    const estimatedGas = await fixedSwapERC20Contract.estimateGas.creatorClaimCall(...args).catch((error: Error) => {
      console.debug('Failed to claim for creator', error)
      throw error
    })
    return fixedSwapERC20Contract
      .creatorClaimCall(...args, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Creator claim assets for ${name}`,
          userSubmitted: {
            account,
            action: `creatorClaimCall`,
            key: poolId
          }
        })
        return {
          hash: response.hash,
          transactionReceipt: response.wait(1)
        }
      })
  }, [account, addTransaction, fixedSwapERC20Contract, name, poolId])

  return { submitted, run }
}
