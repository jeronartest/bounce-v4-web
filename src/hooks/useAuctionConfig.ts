import { AuctionType, TokenType } from '../bounceComponents/create-auction-pool/types'
import { AuctionConfig } from '../constants/auctionConfig'
import { ChainId } from '../constants/chain'

export function useAuctionConfigList(chainId?: ChainId, tokenType?: TokenType): [TokenType[], AuctionType[]] {
  if (!chainId) return [[], []]
  if (!tokenType) {
    return [Object.keys(AuctionConfig[chainId]) as TokenType[], []]
  }
  return [Object.keys(AuctionConfig[chainId]) as TokenType[], AuctionConfig[chainId]?.[tokenType] || []]
}
