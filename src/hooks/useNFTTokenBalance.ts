import { ChainId } from 'constants/chain'
import { useERC1155Contract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useERC1155Balance(
  tokenAddress: string | undefined,
  account: string | undefined,
  tokenId: number | string | undefined,
  queryChainId?: ChainId
): string | undefined {
  const contract = useERC1155Contract(tokenAddress, queryChainId)
  const res = useSingleCallResult(
    tokenId && account ? contract : null,
    'balanceOf',
    [account, tokenId],
    undefined,
    queryChainId
  ).result

  return res?.[0].toString()
}
