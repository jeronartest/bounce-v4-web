import { useRequest } from 'ahooks'
import { useErc20Contract } from './useContractHooks/useContract'
import { Erc20 } from 'constants/web3/contractTypes'

const tokenAllowanceCall = (contract: Erc20, owner: string, spender: string) => {
  return contract.allowance(owner, spender)
}

const useTokenAllowance = (tokenAddress: string, owner: string, spender: string, options?: { manual?: boolean }) => {
  const contract = useErc20Contract(tokenAddress)

  return useRequest(
    async () => {
      if (!contract) {
        return Promise.reject(new Error('No contract'))
      }
      return tokenAllowanceCall(contract, owner, spender)
    },
    { ready: !!contract, ...options }
  )
}

export default useTokenAllowance
