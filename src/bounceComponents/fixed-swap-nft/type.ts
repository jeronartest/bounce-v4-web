export interface Token {
  address: string
  symbol: string
  logoURI?: string
  decimals: number
  name: string
  dangerous?: boolean
}
