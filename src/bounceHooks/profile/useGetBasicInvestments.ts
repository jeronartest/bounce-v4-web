import { useRequest } from 'ahooks'
import { getBasicInvestments } from 'api/profile'

export const useGetBasicInvestments = () => {
  const { data, runAsync } = useRequest(getBasicInvestments, {
    cacheKey: 'BASIC_INVESTMENT',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    }
  })
  return { data, runAsync }
}
