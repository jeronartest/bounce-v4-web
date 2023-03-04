import { useRequest } from 'ahooks'
import { getCompanyInvestors } from '@/api/company'

export const useGetCompanyInvestors = () => {
  const { data, runAsync } = useRequest(getCompanyInvestors, {
    cacheKey: 'COMPANY_INVESTORS',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    },
  })
  return { data, runAsync }
}
