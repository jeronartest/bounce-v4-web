import { AbstractConnector } from '@web3-react/abstract-connector'
import { Currency } from './token'
import { injected, walletconnect, walletlink } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BAST_TOKEN: { [chainId in ChainId]?: Currency } = {
  [ChainId.MAINNET]: new Currency(ChainId.MAINNET, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT')
}

export const autoConnectInjectedEveryone = false

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  }
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

export const NULL_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const FIXED_SWAP_ERC20_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x9e2C12D9240BF267fbeBD510d47Ac3AbD4D9d9ee',
  [ChainId.GÖRLI]: process.env.REACT_APP_GOERLI_FIXED_SWAP_ERC20_ADDRESS || '',
  [ChainId.BSC]: process.env.REACT_APP_BSC_FIXED_SWAP_ERC20_ADDRESS || '',
  [ChainId.ARBITRUM]: process.env.REACT_APP_ARBITRUM_FIXED_SWAP_ERC20_ADDRESS || '',
  [ChainId.BSCTEST]: '',
  [ChainId.POLYGON]: '0x5b5E07c8c05489CD0D2227AfA816478cD039c624',
  [ChainId.POLYGON_ZK_EVM_TESTNET]: '0x194C02845d77ffCB8580D474Ca99013073C1eAb1',
  [ChainId.SEPOLIA]: '0x73282A63F0e3D7e9604575420F777361ecA3C86A'
}
