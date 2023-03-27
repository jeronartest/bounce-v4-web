import { ApiInstance } from 'api'
import {
  GetAddressActivitiesParams,
  GetAddressActivitiesRes,
  GetUserPoolsDashboardCollectRes,
  GetUserPoolsDashboardParams,
  GetUserPoolsDashboardRes,
  GetUserPoolsDashboardStatRes
} from './types'

export const getUserPoolsDashboardCreated = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>('/user/pools/dashboard/created', params)
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

export const getUserPoolsTokenParticipant = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>('/user/pools/token/participant', params)
}

export const getUserPoolsTokenCreated = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>('/user/pools/token/created', params)
}

export const getUserPoolsTokenCollect = (params: GetUserPoolsDashboardParams) => {
  return ApiInstance.post<{ list: GetUserPoolsDashboardRes[]; total: number }>('/user/pools/token/collect', params)
}

export const getAddressActivities = (params: GetAddressActivitiesParams) => {
  return ApiInstance.post<{ list: GetAddressActivitiesRes[]; total: number }>('/user/pools/activities', params)
}
