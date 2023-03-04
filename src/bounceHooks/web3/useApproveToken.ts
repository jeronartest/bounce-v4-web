import { BigNumberish } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useRequest } from 'ahooks'
import useTokenAllowance from './useTokenAllowance'
import { useErc20Contract } from './useContractHooks/useContract'
import { Erc20 } from 'constants/web3/contractTypes'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

const approveTokenCall = async (contract: Erc20, spender: string, amountToApprove: BigNumberish) => {
  const tx = await contract.approve(spender, amountToApprove)
  return tx.wait(1)
}

const tokenAllowanceCall = (contract: Erc20, owner: string, spender: string) => {
  return contract.allowance(owner, spender)
}

const useApproveToken = (tokenToApprove: { decimals: string; address: string }) => {
  const { address: account, isConnected } = useAccount()

  const contract = useErc20Contract(tokenToApprove.address)

  return useRequest(
    async (spender: string, amountToApprove: BigNumberish) => {
      const currentAllowance = await tokenAllowanceCall(contract, account, spender)

      if (currentAllowance.lt(amountToApprove)) {
        return approveTokenCall(contract, spender, amountToApprove)
      }
    },
    {
      manual: true,
      ready: !!contract && isConnected
    }
  )
}

export default useApproveToken
