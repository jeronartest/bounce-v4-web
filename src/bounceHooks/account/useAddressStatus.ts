import { useRequest } from 'ahooks'
import { getUserPoolsTokenParticipant, getUserPoolsTokenCreated } from 'api/account'
import { DashboardQueryType } from 'api/account/types'
import { FixedSwapPool, PoolType } from 'api/pool/type'

export function useUserPoolsTokenCreated(
  address: string | undefined,
  queryType: DashboardQueryType,
  category?: PoolType
) {
  return useRequest(
    async () => {
      if (!address) return []
      const response = await getUserPoolsTokenCreated({
        address,
        chainId: 0,
        queryType,
        category: category || 1,
        limit: 100
      })
      return response.data[category === PoolType.fixedSwapNft ? 'fixedSwapNftList' : 'fixedSwapList']
        .list as FixedSwapPool[]
    },
    {
      refreshDeps: [address, queryType, category],
      debounceWait: 100
    }
  )
}

export function useUserPoolsTokenParticipant(
  address: string | undefined,
  queryType?: DashboardQueryType,
  category?: PoolType
) {
  return useRequest(
    async () => {
      if (!address) return []
      // tokenType erc20:1 , erc1155:2
      const tokenType = category === PoolType.fixedSwapNft ? 2 : 1
      const response = await getUserPoolsTokenParticipant({
        address,
        chainId: 0,
        queryType,
        category: category || 1,
        limit: 100,
        tokenType: tokenType
      })
      return response.data[category === PoolType.fixedSwapNft ? 'fixedSwapNftList' : 'fixedSwapList']
        .list as FixedSwapPool[]
    },
    { refreshDeps: [address, queryType, category], debounceWait: 100 }
  )
}
