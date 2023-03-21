import { AuctionType, TokenType } from '../bounceComponents/create-auction-pool/types'
import { ChainId } from './chain'

export const AuctionConfig: {
  [chainId in ChainId]: {
    [tokenType in TokenType]?: AuctionType[]
  }
} = {
  [ChainId.MAINNET]: {
    [TokenType.ERC20]: [AuctionType.FIXED_PRICE]
    // [TokenType.ERC721]: [],
    // [TokenType.ERC1155]: []
  },
  [ChainId.BSC]: {
    [TokenType.ERC20]: [AuctionType.FIXED_PRICE]
    // [TokenType.ERC721]: [],
    // [TokenType.ERC1155]: []
  },
  [ChainId.GÖRLI]: {
    [TokenType.ERC20]: [AuctionType.FIXED_PRICE]
    // [TokenType.ERC721]: [],
    // [TokenType.ERC1155]: []
  },
  [ChainId.ARBITRUM]: {
    [TokenType.ERC20]: [AuctionType.FIXED_PRICE]
    // [TokenType.ERC721]: [],
    // [TokenType.ERC1155]: []
  }
}
