import { Token } from 'bounceComponents/fixed-swap/type'
import { ChainId } from 'constants/chain'

export const AUCTION_TYPES = ['fixed-price']

export const isSupportedAuctionType = (auctionType: string | undefined | null): boolean => {
  return !!auctionType && AUCTION_TYPES.includes(auctionType)
}

export const GOERLI_TOKEN_LIST: Token[] = [
  {
    chainId: ChainId.GÖRLI,
    name: 'Wrapped Ether',
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    symbol: 'WETH',
    decimals: 18,
    // logoURI:
    //   'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png',
    logoURI: ''
  },
  {
    chainId: ChainId.GÖRLI,
    address: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    // logoURI: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
    logoURI: ''
  },
  {
    chainId: ChainId.GÖRLI,
    address: '0x0A6318AB6B0C414679c0eB6a97035f4a3ef98606',
    name: 'Bounce Token',
    symbol: 'AUCTION',
    decimals: 18,
    logoURI: ''
  },
  {
    chainId: ChainId.GÖRLI,
    address: '0x53C0475aa628D9C8C5724A2eb8B5Fd81c32a9267',
    name: 'tty',
    symbol: 'TTY',
    decimals: 18,
    logoURI: ''
  }
]

export const TOKEN_LIST_API: Record<ChainId, string | null> = {
  [ChainId.MAINNET]: 'https://tokens.coingecko.com/uniswap/all.json',
  [ChainId.GÖRLI]: null,
  [ChainId.BSC]: 'https://tokens.pancakeswap.finance/cmc.json',
  [ChainId.ARBITRUM]: null
}
