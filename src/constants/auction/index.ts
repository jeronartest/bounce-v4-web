import { CHAIN_ICONS, SupportedChainId } from '../web3/chains'
import { Token } from 'bounceComponents/create-auction-pool/types'

export const AUCTION_TYPES = ['fixed-price']

export const isSupportedAuctionType = (auctionType: string | undefined | null): boolean => {
  return !!auctionType && AUCTION_TYPES.includes(auctionType)
}
export const AUCTION_TOKEN = {
  symbol: 'AUCTION',
  name: 'Bounce Token',
  address: '0x0A6318AB6B0C414679c0eB6a97035f4a3ef98606',
  decimals: 18
}
export const TEST_TOKEN = {
  symbol: 'TEST',
  name: 'Test Token',
  address: '0x1f77903BeCDddF412B6Ae2d649726b22BF26E4B5',
  decimals: 18
}
export const LINK_TOKEN = {
  symbol: 'LINK',
  name: 'ChainLink Token',
  address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  decimals: 18
}
export const YEENUS_TOKEN = {
  symbol: 'YEENUS',
  name: 'Yeenus',
  address: '0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7',
  decimals: 8
}
export const DAI_TOKEN = {
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  decimals: 18
}
export const ZETA_TOKEN = {
  symbol: 'ZETA',
  name: 'Zeta',
  address: '0xCc7bb2D219A0FC08033E130629C2B854b7bA9195',
  decimals: 18
}
export const CRV_TOKEN = {
  symbol: 'CRV',
  name: 'Curve DAO Token',
  address: '0x976d27eC7ebb1136cd7770F5e06aC917Aa9C672b',
  decimals: 18
}

export const GOERLI_TOKEN_LIST = [
  {
    name: 'Wrapped Ether',
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    symbol: 'WETH',
    decimals: 18,
    // logoURI:
    //   'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png',
    logoURI: ''
  },
  {
    address: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    // logoURI: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
    logoURI: ''
  },
  {
    address: '0x0A6318AB6B0C414679c0eB6a97035f4a3ef98606',
    name: 'Bounce Token',
    symbol: 'AUCTION',
    decimals: 18,
    logoURI: ''
  }
]

export const NATIVE_TOEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETH_TOKEN: Token = {
  symbol: 'ETH',
  name: 'Ethereum',
  address: NATIVE_TOEN_ADDRESS,
  decimals: 18,
  logoURI: CHAIN_ICONS[SupportedChainId.MAINNET]
}
export const BNB_TOKEN: Token = {
  symbol: 'BNB',
  name: 'BNB',
  address: NATIVE_TOEN_ADDRESS,
  decimals: 18,
  logoURI: CHAIN_ICONS[SupportedChainId.BSC]
}
export const ARBITRUM_ETH_TOKEN: Token = {
  symbol: 'ETH',
  name: 'Ethereum',
  address: NATIVE_TOEN_ADDRESS,
  decimals: 18,
  logoURI: CHAIN_ICONS[SupportedChainId.ARBITRUM]
}

export const NATIVE_TOKENS: Record<SupportedChainId, Token> = {
  [SupportedChainId.MAINNET]: ETH_TOKEN,
  [SupportedChainId.GOERLI]: ETH_TOKEN,
  [SupportedChainId.BSC]: BNB_TOKEN,
  [SupportedChainId.ARBITRUM]: ARBITRUM_ETH_TOKEN
}

export const TOKEN_LIST_API: Record<SupportedChainId, string | null> = {
  [SupportedChainId.MAINNET]: 'https://tokens.coingecko.com/uniswap/all.json',
  [SupportedChainId.GOERLI]: null,
  [SupportedChainId.BSC]: 'https://tokens.pancakeswap.finance/cmc.json',
  [SupportedChainId.ARBITRUM]: null
}
