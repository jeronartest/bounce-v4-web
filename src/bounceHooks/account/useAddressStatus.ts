import { useRequest } from 'ahooks'
import { getUserPoolsTokenParticipant, getUserPoolsTokenCreated } from 'api/account'
import { DashboardQueryType } from 'api/account/types'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { BackedTokenType } from 'pages/account/MyTokenOrNFT'

export function useUserPoolsTokenCreated(
  address: string | undefined,
  queryType: DashboardQueryType,
  category: PoolType | 0,
  tokenType: BackedTokenType
) {
  return useRequest(
    async () => {
      if (!address) return []
      const response = await getUserPoolsTokenCreated({
        address,
        chainId: 0,
        queryType,
        category,
        tokenType,
        limit: 100
      })
      return response.data[tokenType === BackedTokenType.NFT ? 'fixedSwapNftList' : 'fixedSwapList']
        .list as FixedSwapPool[]
    },
    {
      refreshDeps: [address, queryType, category, tokenType],
      debounceWait: 100
    }
  )
}

export function useUserPoolsTokenParticipant(
  address: string | undefined,
  queryType: DashboardQueryType,
  category: PoolType | 0,
  tokenType: BackedTokenType
) {
  return useRequest(
    async () => {
      if (!address) return []
      const response = await getUserPoolsTokenParticipant({
        address,
        chainId: 0,
        queryType,
        category,
        limit: 100,
        tokenType
      })
      return response.data[tokenType === BackedTokenType.NFT ? 'fixedSwapNftList' : 'fixedSwapList']
        .list as FixedSwapPool[]
    },
    { refreshDeps: [address, queryType, category, tokenType], debounceWait: 100 }
  )
}
