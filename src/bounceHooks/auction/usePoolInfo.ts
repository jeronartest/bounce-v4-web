import { useRequest } from 'ahooks'

import useChainConfigInBackend from '../web3/useChainConfigInBackend'
import { getPoolInfo } from 'api/pool'
import { FixedSwapPoolProp, PoolType } from 'api/pool/type'
import { useQueryParams } from 'hooks/useQueryParams'
import { Currency, CurrencyAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'

const usePoolInfo = () => {
  const { poolId, chainShortName } = useQueryParams()
  const { account } = useActiveWeb3React()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName || '')

  return useRequest(
    async (): Promise<FixedSwapPoolProp> => {
      if (typeof poolId !== 'string' || !chainConfigInBackend?.id) {
        return Promise.reject(new Error('Invalid poolId'))
      }

      const response = await getPoolInfo({
        poolId,
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend.id,
        address: account || ''
      })

      const rawPoolInfo = response.data.fixedSwapPool

      const _t0 = rawPoolInfo.token0
      const t0 = new Currency(chainConfigInBackend.id, _t0.address, _t0.decimals, _t0.symbol, _t0.name, _t0.smallUrl)
      const _t1 = rawPoolInfo.token1
      const t1 = new Currency(chainConfigInBackend.id, _t1.address, _t1.decimals, _t1.symbol, _t1.name, _t1.smallUrl)

      return {
        ...rawPoolInfo,
        token0: {
          ...rawPoolInfo.token0,
          symbol: rawPoolInfo.token0.symbol.toUpperCase()
        },
        token1: {
          ...rawPoolInfo.token1,
          symbol: rawPoolInfo.token1.symbol.toUpperCase()
        },
        currencyAmount0: CurrencyAmount.fromRawAmount(t0, rawPoolInfo.amountTotal0),
        currencyAmount1: CurrencyAmount.fromRawAmount(t1, rawPoolInfo.amountTotal1),
        currencySwappedAmount0: CurrencyAmount.fromRawAmount(t0, rawPoolInfo.swappedAmount0),
        currencyMaxAmount1PerWallet: CurrencyAmount.fromRawAmount(t1, rawPoolInfo.maxAmount1PerWallet),
        currencyCurrentTotal0: CurrencyAmount.fromRawAmount(t0, rawPoolInfo.currentTotal0),
        currencyCurrentTotal1: CurrencyAmount.fromRawAmount(t1, rawPoolInfo.amountTotal1)
      }
    },
    {
      // cacheKey: `POOL_INFO_${poolId}`,
      ready: !!poolId && !!chainConfigInBackend?.id,
      pollingInterval: 30000,
      refreshDeps: [account]
    }
  )
}

export default usePoolInfo
