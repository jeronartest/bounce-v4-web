/* eslint-disable prettier/prettier */
import { useRequest } from 'ahooks'
import { getNftInfoByNftGo } from 'utils/nftGo'

const useNftGoApi = (contract_address: string, tokenId: number | string) => {
    return useRequest(
        async () => {
            if (typeof contract_address !== 'string') {
                return Promise.reject(new Error('Invalid contract_address'))
            }
            const response = await getNftInfoByNftGo(contract_address, tokenId)
            return response
        },
        {
            ready: !!contract_address && !!tokenId,
            pollingInterval: 30000,
        },
    )
}
export default useNftGoApi
