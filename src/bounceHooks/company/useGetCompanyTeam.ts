import { useRequest } from 'ahooks'
import { getCompanyTeam } from 'api/company'

export const useGetCompanyTeam = () => {
  const { data, runAsync } = useRequest(getCompanyTeam, {
    cacheKey: 'COMPANY_TEAM',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    }
  })
  return { data, runAsync }
}
