import { useRequest } from 'ahooks'
import { BigNumberish } from 'ethers'
import { useErc20Contract } from './useContract'
import { Erc20 } from '@/constants/web3/contractTypes'

export const useErc20TokenName = (address: string) => {
  const contract = useErc20Contract(address)

  console.log('contract: ', contract)

  return useRequest(
    async () => {
      if (!contract) {
        return Promise.reject('no contract')
      }

      return contract.name()
    },
    {
      ready: !!contract,
      manual: true,
      onSuccess: (data) => {
        console.log('token name: ', data)
      },
    },
  )
}

export const useErc20TokenSymbol = (address: string) => {
  const contract = useErc20Contract(address)

  return useRequest(
    async () => {
      if (!contract) {
        return Promise.reject('no contract')
      }

      return contract.symbol()
    },
    {
      ready: !!contract,
      // manual: true,
      onSuccess: (data) => {
        console.log('token symbol: ', data)
      },
      onError: (error) => {
        console.log('symbol error: ', error)
      },
    },
  )
}

export const getErc20TokenAllowance = async (contract: Erc20, owner: string, spender: string) => {
  return contract.allowance(owner, spender)
}

export const approveErc20TokenAllowance = async (contract: Erc20, spender: string, value: BigNumberish) => {
  const tx = await contract.approve(spender, value)
  const receipt = await tx.wait(1)
  return receipt
}

export const useAllowance = (address: string) => {
  const contract = useErc20Contract(address)
  return useRequest(
    async (owner: string, spender: string) => {
      if (!contract) {
        return Promise.reject('no contract')
      }

      getErc20TokenAllowance(contract, owner, spender)
    },
    {
      ready: !!contract,
      manual: true,
      onError: (error) => {
        console.log('approve error: ', error)
      },
    },
  )
}

export const getTokenBalance = (contract: Erc20, account: string) => {
  return contract.balanceOf(account)
}
