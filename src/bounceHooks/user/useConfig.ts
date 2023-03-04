import { useRequest } from 'ahooks'
import { getConfig } from 'api/user'

export const useConfig = () => {
  const { data, runAsync } = useRequest(getConfig, {
    cacheKey: 'USER_CONFIG',
    manual: true,
    onSuccess: (response: any) => {
      if (response.code === 200) {
        return response.data
      }
    }
  })
  return { data, runAsync }
}
