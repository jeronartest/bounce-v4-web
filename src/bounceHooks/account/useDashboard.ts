import { useRequest } from 'ahooks'
import { getUserDashboardStat, getUserPoolsDashboardCollect, getUserPoolsDashboardCreated } from 'api/account'
import { DashboardQueryType } from 'api/account/types'

export function useDashboardUserCreated(queryType: DashboardQueryType) {
  return useRequest(
    async () => {
      const response = await getUserPoolsDashboardCreated({
        chainId: 0,
        queryType,
        category: 1,
        limit: 100
      })

      return response.data.list
    },
    {
      debounceWait: 100
    }
  )
}

export function useDashboardUserCollect(queryType?: DashboardQueryType) {
  return useRequest(
    async () => {
      const response = await getUserPoolsDashboardCollect({
        chainId: 0,
        category: 1,
        limit: 100,
        queryType
      })

      return response.data.list
    },
    { debounceWait: 100 }
  )
}

export function useDashboardStat() {
  return useRequest(
    async () => {
      const response = await getUserDashboardStat()

      return response.data
    },
    { debounceWait: 100 }
  )
}
