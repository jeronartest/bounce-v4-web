import { useRequest } from 'ahooks'
import { claimCheck, getUserUnverify, verifyAccount } from 'api/user'
import { IGetUserUnverifyParams } from 'api/user/type'

export const useGetUserUnverify = (params: IGetUserUnverifyParams) => {
  return useRequest(async () => {
    const res = await getUserUnverify(params)
    return {
      list: res?.data?.list,
      total: res?.data?.total
    }
  })
}

export const useClaimCheck = () => {
  return useRequest(async params => claimCheck(params), {
    manual: true
  })
}

export const useVerifyAccount = () => {
  return useRequest(async params => verifyAccount(params), {
    manual: true
  })
}
