import { useRequest } from 'ahooks'
import { getResumeEducation } from '@/api/profile'

export const useGetResumeEducation = () => {
  const { data, runAsync } = useRequest(getResumeEducation, {
    cacheKey: 'RESUME_EDUCATION',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    },
  })
  return { data, runAsync }
}
