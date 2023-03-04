import { useRequest } from 'ahooks'
import { getResumeExperience } from '@/api/profile'

export const useGetResumeExperience = () => {
  const { data, runAsync } = useRequest(getResumeExperience, {
    cacheKey: 'RESUME_EXPERIENCE',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    },
  })
  return { data, runAsync }
}
