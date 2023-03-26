import { ApiInstance } from 'api'
import {
  GetUserPoolsDashboardCollectRes,
  GetUserPoolsDashboardParams,
  GetUserPoolsDashboardRes,
  GetUserPoolsDashboardStatRes
} from './types'

export const getUserPoolsDashboardCreated = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>('/user/pools/dashboard/created', params)
}

export const getUserPoolsDashboardParticipant = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>(
    '/user/pools/dashboard/participant',
    params
  )
}

export const getUserPoolsDashboardCollect = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardCollectRes[]; total: number }>(
    '/user/pools/dashboard/collect',
    params
  )
}

export const getUserDashboardStat = () => {
  return ApiInstance.get<GetUserPoolsDashboardStatRes>('/user/pools/dashboard/stat', {})
}
