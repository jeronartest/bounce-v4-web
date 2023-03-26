import { PoolType } from 'api/pool/type'

export interface GetUserPoolsDashboardParams {
  address?: string
  category?: PoolType // 1="fixed_swap", 2="dutch", 3="lottery", 4="sealed_bid", 5="fixed_swap_nft"
  chainId: number
  limit?: number
  offset?: number
  queryType: DashboardQueryType
}

export enum DashboardQueryType {
  ongoing = 1,
  claim = 2
}

export interface GetUserPoolsDashboardRes {
  category: PoolType
  chainId: number
  poolId: number
}

export interface GetUserPoolsDashboardCollectRes extends GetUserPoolsDashboardRes {
  openAt: number
}

export interface GetUserPoolsDashboardStatRes {
  buyVolume: string
  createdCount: number
  participantCount: number
  saledVolume: string
}
