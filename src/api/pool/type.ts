import { CurrencyAmount } from 'constants/token'

export enum PoolType {
  'FixedSwap' = 1,
  'Duch' = 2,
  'Lottery' = 3,
  'SealedBid' = 4
}

export interface GetPoolCreationSignatureParams {
  amountTotal0: string
  amountTotal1: string
  category: PoolType
  chainId: number
  claimAt: number
  closeAt: number
  creator: string
  maxAmount1PerWallet: string
  merkleroot: string
  name: string
  openAt: number
  token0: string
  token1: string
}

export interface GetPoolCreationSignatureResponse {
  expiredTime: number
  signature: string
}

export interface GetWhitelistMerkleTreeRootParams {
  addresses: string[]
  category: PoolType
  chainId: number
}

export interface GetWhitelistMerkleTreeRootResponse {
  merkleroot: string
}

export enum PoolStatus {
  'Upcoming' = 1,
  'Live' = 2,
  'Closed' = 4,
  'Cancelled' = 5
}

export interface GetPoolInfoParams {
  category: PoolType
  chainId: number
  poolId: string
  address?: string
}

export interface TokenFromApi {
  address: string
  coingeckoId: string
  currentPrice: number
  decimals: number
  largeUrl?: string
  name: string
  smallUrl?: string
  symbol: string
  thumbUrl?: string
}

export interface CreatorUserInfo {
  avatar: string
  companyAvatar: string
  companyIntroduction: string
  companyName: string
  name: string
  publicRole?: null[] | null
  userId: number
  userType: number
}

export interface LikeInfo {
  dislikeCount: number
  likeCount: number
  myDislike: number
  myLike: number
}
export interface FixedSwapPool {
  amountTotal0: string
  amountTotal1: string
  category: PoolType
  chainId: number
  claimAt: number
  closeAt: number
  contract: string
  createdTxHash: string
  creator: string
  creatorClaimed: boolean
  creatorUserInfo: CreatorUserInfo
  likeInfo: LikeInfo
  id: number
  currentTotal0: string
  currentTotal1: string
  enableWhiteList: boolean
  maxAmount1PerWallet: string
  name: string
  openAt: number
  participant: {
    address?: string
    claimed?: boolean
    regreted?: boolean
    swappedAmount0?: string
  }
  poolId: string
  poolPrice: number
  ratio: string
  status: PoolStatus
  swappedAmount0: string
  token0: TokenFromApi
  token1: TokenFromApi
}

export interface FixedSwapPoolProp extends FixedSwapPool {
  currencyAmount0: CurrencyAmount
  currencyAmount1: CurrencyAmount
  currencySwappedAmount0: CurrencyAmount
  currencyMaxAmount1PerWallet: CurrencyAmount
  currencyCurrentTotal0: CurrencyAmount
  currencyCurrentTotal1: CurrencyAmount
}

export interface GetPoolInfoResponse {
  dutchPool: any
  fixedSwapPool: FixedSwapPool
  lotteryPool: any
  sealedBidPool: any
}

export interface GetPoolHistoryParams {
  address: string
  category: PoolType
  chainId: number
  poolId: string
}

export type PoolEvent = 'Swapped' | 'Reversed'

export interface PoolHistory {
  //block timestamp
  blockTs: number

  //pool auction type: 1="fixed_swap", 2="dutch", 3="lottery", 4="sealed_bid"
  category: number

  //chain id, offered by backend api
  chainId: number

  //event name: Swapped,Reversed
  event: PoolEvent

  //activity id in db
  id: number

  //pool id in contract, in decimal
  poolId: string

  //user regreted or not
  regreted: boolean

  //buyer wallet address
  requestor: string

  //token sold (token0) amount, in decimal.
  token0Amount: string

  token0Decimals: string

  //token sold (token0) symbol
  token0Symbol: string

  //token sold (token0) total volume. unit is USD. calculated by price of token 1
  token0Volume: number

  //tx hash
  txHash: string
}

export interface GetPoolHistoryResponse {
  list: PoolHistory[]
  total: number
}
