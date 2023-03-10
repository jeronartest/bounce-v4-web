import { ChainId } from 'constants/chain'

export interface Token {
  chainId: ChainId
  address: string
  decimals: number
  symbol?: string
  logoURI?: string
  name?: string
  dangerous?: boolean
}
