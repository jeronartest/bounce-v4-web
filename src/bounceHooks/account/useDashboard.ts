import { useRequest } from 'ahooks'
import {
  getUserDashboardStat,
  getUserPoolsDashboardCollect,
  getUserPoolsDashboardCreated,
  getUserPoolsDashboardParticipant
} from 'api/account'
import { DashboardQueryType } from 'api/account/types'

export function useDashboardUserCreated() {
  return useRequest(
    async () => {
      const response = await getUserPoolsDashboardCreated({
        chainId: 0,
        queryType: DashboardQueryType.ongoing,
        limit: 100
      })

      return response.data.list
    },
    {
      debounceWait: 100
    }
  )
}

export function useDashboardUserParticipant() {
  return useRequest(
    async () => {
      const response = await getUserPoolsDashboardParticipant({
        chainId: 0,
        queryType: DashboardQueryType.ongoing,
        limit: 100
      })

      return response.data.list
    },
    { debounceWait: 100 }
  )
}

export function useDashboardUserCollect() {
  return useRequest(
    async () => {
      const response = await getUserPoolsDashboardCollect({
        chainId: 0,
        queryType: DashboardQueryType.ongoing,
        limit: 100
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
