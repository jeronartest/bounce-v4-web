import { useState, useEffect, useMemo } from 'react'
import { getUserNFTsInfo } from 'api/user/index'
import { UserNFTCollection } from 'api/user/type'
import { useActiveWeb3React } from 'hooks'
import { Response1155Token } from './use1155TokenList'

export function use721TokenList(chainId: string | number): {
  loading: boolean
  data: Response1155Token
} {
  const { account } = useActiveWeb3React()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [list, setList] = useState<Response1155Token>({})
  useEffect(() => {
    const fun = async () => {
      try {
        const params = {
          chainId: Number(chainId),
          creator: account || '',
          limit: 99999
        }
        setIsLoading(true)
        setList({})
        const res = await getUserNFTsInfo(params)
        setIsLoading(false)
        const { list } = res.data
        const nftCollection: Response1155Token = {}
        list.map((item: UserNFTCollection) => {
          if (!item.contractAddr) return
          if (!Object.prototype.hasOwnProperty.call(nftCollection, item.contractAddr)) {
            nftCollection[item.contractAddr] = []
          }
          nftCollection[item.contractAddr].push({
            balance: '1',
            contractAddr: '0x45B70E9960a244479a124cb6fe7E230b66325656',
            contractName: 'test',
            description: 'test',
            image: '',
            name: 'test',
            tokenId: '282'
          })
          nftCollection[item.contractAddr].push({
            balance: '1',
            contractAddr: '0x45B70E9960a244479a124cb6fe7E230b66325656',
            contractName: 'test',
            description: 'test',
            image: '',
            name: 'test',
            tokenId: '283'
          })
        })
        setList(nftCollection)
      } catch (error) {
        console.error('fetch user nfts error', error)
      }
    }
    fun()
  }, [account, chainId])
  const res = useMemo(() => ({ loading: isLoading, data: list }), [isLoading, list])
  return res
}

export default use721TokenList
