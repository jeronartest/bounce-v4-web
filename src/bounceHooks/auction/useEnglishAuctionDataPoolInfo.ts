import { Currency } from 'constants/token/currency'
import { CurrencyAmount } from 'constants/token/fractions/currencyAmount'
import { useQueryParams } from 'hooks/useQueryParams'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useBackedPoolInfo } from './usePoolInfo'
import { useActiveWeb3React } from 'hooks'
import { useEnglishAuctionNftContract } from 'hooks/useContract'
import { EnglishAuctionNFTPoolProp, PoolType } from 'api/pool/type'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'

export function useEnglishAuctionDataPoolInfo() {
  const { poolId, chainShortName } = useQueryParams()
  const { account } = useActiveWeb3React()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName || '')
  const { data: poolInfo, run: getPoolInfo, loading } = useBackedPoolInfo(PoolType.fixedSwapNft)

  const englishAuctionNftContract = useEnglishAuctionNftContract()

  const poolsRes = useSingleCallResult(
    englishAuctionNftContract,
    'pools',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const creatorClaimedRes = useSingleCallResult(
    englishAuctionNftContract,
    'creatorClaimed',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const currentBidderRes = useSingleCallResult(
    englishAuctionNftContract,
    'currentBidder',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const currentBidderAmount1Res = useSingleCallResult(
    englishAuctionNftContract,
    'currentBidderAmount1',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const currentBidderMinAmountRes = useSingleCallResult(
    englishAuctionNftContract,
    'currentBidderAmount',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const gasFeeRes = useSingleCallResult(
    englishAuctionNftContract,
    'gasFee',
    [poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result
  const myClaimedRes = useSingleCallResult(
    englishAuctionNftContract,
    'myClaimed',
    [account || undefined, poolId],
    undefined,
    chainConfigInBackend?.ethChainId
  ).result

  const data = useMemo(() => {
    if (!poolInfo || !chainConfigInBackend?.ethChainId) return undefined
    const _t1 = poolInfo?.token1
    const t1 = new Currency(
      chainConfigInBackend?.ethChainId,
      _t1.address,
      _t1.decimals,
      _t1.symbol,
      _t1.name,
      _t1.smallUrl
    )

    const _pools = {
      amountTotal0: poolsRes?.amountTotal0.toString() || poolInfo.amountTotal0,
      currencyAmountMin1: CurrencyAmount.fromRawAmount(t1, poolsRes?.amountMin1.toString()),
      currencyAmountMinIncr1: CurrencyAmount.fromRawAmount(t1, poolsRes?.currencyAmountMinIncr1.toString())
    }

    const result: EnglishAuctionNFTPoolProp = {
      ...poolInfo,
      ..._pools,
      participant: {
        ...poolInfo.participant,
        claimed: myClaimedRes?.[0]
      },
      creatorClaimed: creatorClaimedRes?.[0] || poolInfo.creatorClaimed,
      currentBidder: currentBidderRes?.[0].toString(),
      currentBidderAmount1: CurrencyAmount.fromRawAmount(t1, currentBidderAmount1Res?.[0].toString()),
      currentBidderMinAmount: CurrencyAmount.fromRawAmount(t1, currentBidderMinAmountRes?.[0].toString()),
      gasFee: CurrencyAmount.fromRawAmount(
        Currency.getNativeCurrency(chainConfigInBackend.ethChainId),
        gasFeeRes?.[0].toString()
      )
    }

    return result
  }, [
    chainConfigInBackend?.ethChainId,
    creatorClaimedRes,
    currentBidderAmount1Res,
    currentBidderMinAmountRes,
    currentBidderRes,
    gasFeeRes,
    myClaimedRes,
    poolInfo,
    poolsRes?.amountMin1,
    poolsRes?.amountTotal0,
    poolsRes?.currencyAmountMinIncr1
  ])

  return {
    loading,
    run: getPoolInfo,
    data
  }
}
