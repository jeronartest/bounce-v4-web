import { ApiInstance } from '..'
import {
  IGetCompanyTokensParams,
  ICompanyInfoParams,
  IGetCompanyInvestorsParams,
  IGetCompanyMembersListParams,
  ICompanyProfileParams
} from './type'

export const getCompanyTeam = (params: IGetCompanyInvestorsParams) => {
  return ApiInstance.get('/company/member/list', params)
}

export const updateCompanyProfile = (body: ICompanyProfileParams) => {
  return ApiInstance.post('/company/action/profile/update', body)
}

export const getCompanyInfo = (params: ICompanyInfoParams) => {
  return ApiInstance.post('/company/overview', params)
}

export const getCompanyInvestors = (params: IGetCompanyInvestorsParams) => {
  return ApiInstance.get('/company/investor/list', params)
}

export const getCompanyInvestments = (params: IGetCompanyInvestorsParams) => {
  return ApiInstance.get('/company/investment/list', params)
}

export const getCompanyTokens = (params: IGetCompanyTokensParams) => {
  return ApiInstance.get('/company/activity_token/list', params)
}
export const getCompanyMembersList = (params: IGetCompanyMembersListParams) => {
  return ApiInstance.get('/company/member/list', params)
}
