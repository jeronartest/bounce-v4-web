import { SupportedChainId } from './chains'

export type ContractAddressMap = { [key in SupportedChainId]: `0x${string}` }

export const FIXED_SWAP_CONTRACT_ADDRESSES: ContractAddressMap = {
  [SupportedChainId.MAINNET]: '0x9e2C12D9240BF267fbeBD510d47Ac3AbD4D9d9ee',
  [SupportedChainId.GOERLI]: process.env.REACT_APP_GOERLI_FIXED_SWAP_CONTRACT_ADDRESS as `0x${string}`,
  [SupportedChainId.BSC]: process.env.REACT_APP_BSC_FIXED_SWAP_CONTRACT_ADDRESS as `0x${string}`,
  [SupportedChainId.ARBITRUM]: process.env.REACT_APP_ARBITRUM_FIXED_SWAP_CONTRACT_ADDRESS as `0x${string}`
}

export const NULL_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000'
