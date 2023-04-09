// !todo chainId?
export const getNftInfoByNftGo = async (contract_address: string, tokenId: number | string) => {
  const serviceResp = await fetch(`https://data-api.nftgo.io/eth/v1/nft/${contract_address}/${tokenId}/info`, {
    method: 'get',
    headers: {
      'X-API-KEY': 'a55bb48e-1e68-4573-a30b-ba96b7136565',
      accept: 'application/json'
    }
  })
  const res = await serviceResp?.json()
  return res
}
