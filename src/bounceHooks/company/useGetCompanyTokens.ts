import { useRequest } from 'ahooks'
import { getCompanyTokens } from '@/api/company'

export const useGetCompanyTokens = () => {
  const { data, runAsync } = useRequest(getCompanyTokens, {
    cacheKey: 'COMPANY_TOKENS',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    },
  })
  return { data, runAsync }
}
