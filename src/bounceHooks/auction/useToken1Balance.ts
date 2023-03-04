import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { useAccount, useBalance } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import { balanceOfCall } from '@/utils/web3/contractCalls/erc20'
import { useErc20Contract } from 'bounceHooks/web3/useContractHooks/useContract'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import { NATIVE_TOEN_ADDRESS } from '@/constants/auction'

const useToken1Balance = () => {
  const { address: account } = useAccount()

  const { data: poolInfo } = usePoolInfo()

  const erc20Contract = useErc20Contract(poolInfo.token1.address)

  const isToken1Native = poolInfo.token1.address === NATIVE_TOEN_ADDRESS

  const { data: erc20Token1Balance, loading: isErc20Token1BalanceLoading } = useRequest(
    async () => balanceOfCall(erc20Contract, account),
    {
      ready: !!erc20Contract && !isToken1Native,
      refreshDeps: [account, erc20Contract]
    }
  )

  const { data: nativeToken1BalanceResult, isLoading: isNativeToken1BalanceResultLoading } = useBalance({
    address: account,
    enabled: isToken1Native,
    watch: false
  })

  const token1Balance = useMemo(() => {
    if (isToken1Native) {
      return new BigNumber(nativeToken1BalanceResult?.value.toString())
    } else {
      return new BigNumber(erc20Token1Balance?.toString())
    }
  }, [erc20Token1Balance, isToken1Native, nativeToken1BalanceResult?.value])

  const isToken1BalanceLoading = isToken1Native ? isNativeToken1BalanceResultLoading : isErc20Token1BalanceLoading

  return {
    token1Balance,
    isToken1BalanceLoading
  }
}

export default useToken1Balance
