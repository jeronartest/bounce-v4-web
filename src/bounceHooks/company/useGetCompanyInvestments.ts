import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { getCompanyInvestments } from 'api/company'

export const useGetCompanyInvestments = () => {
  const { data, runAsync } = useRequest(getCompanyInvestments, {
    cacheKey: 'COMPANY_INVESTMENTS',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code !== 200) {
        return toast.error('System failed. Please try again.')
      }

      return response.data
    }
  })
  return { data, runAsync }
}
