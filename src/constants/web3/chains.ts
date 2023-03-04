import EthSVG from '@/assets/imgs/chains/eth.svg'
import BscSVG from '@/assets/imgs/chains/bsc.svg'
import ArbitrumSVG from '@/assets/imgs/icon/arbitrum.svg'

export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  BSC = 56,
  ARBITRUM = 42161,
}

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

export const CHAIN_NAMES: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.GOERLI]: 'Goerli',
  [SupportedChainId.BSC]: 'BSC',
  [SupportedChainId.ARBITRUM]: 'Arbitrum',
}

export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [`https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`],
  [SupportedChainId.GOERLI]: [`https://rpc.ankr.com/eth_goerli`],
  [SupportedChainId.BSC]: [`https://bscrpc.com`],
  [SupportedChainId.ARBITRUM]: [`https://rpc.ankr.com/arbitrum	`],
}

// export const CHAIN_INFOS: Record<SupportedChainId, any> = {
//   [SupportedChainId.MAINNET]: {
//     chainId: SupportedChainId.MAINNET,
//     chainName: CHAIN_NAMES[SupportedChainId.MAINNET],
//     rpcUrls: RPC_URLS[SupportedChainId.MAINNET],
//     blockExplorerUrls: ['https://etherscan.io'],
//     nativeCurrency: {
//       name: 'Ethereum',
//       symbol: 'ETH',
//       decimals: 18,
//     },
//   },
//   [SupportedChainId.GOERLI]: {
//     chainId: SupportedChainId.GOERLI,
//     chainName: CHAIN_NAMES[SupportedChainId.GOERLI],
//     rpcUrls: RPC_URLS[SupportedChainId.GOERLI],
//     blockExplorerUrls: ['https://goerli.etherscan.io'],
//     nativeCurrency: {
//       name: 'Ethereum',
//       symbol: 'GoerliETH',
//       decimals: 18,
//     },
//   },
// }

export const CHAIN_SHORT_NAME_IN_BACKEND: Record<SupportedChainId, string> = {
  [SupportedChainId.MAINNET]: 'ETH',
  [SupportedChainId.GOERLI]: 'GoerliETH',
  [SupportedChainId.BSC]: 'BSC',
  [SupportedChainId.ARBITRUM]: 'ARBI',
}

export const CHAIN_ICONS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: EthSVG,
  [SupportedChainId.GOERLI]: EthSVG,
  [SupportedChainId.BSC]: BscSVG,
  [SupportedChainId.ARBITRUM]: ArbitrumSVG,
}
