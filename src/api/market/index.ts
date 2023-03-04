import { ApiInstance } from '..'
import { ICompanyInformationParams, IInstitutionInvestorsParams, IPoolsParams } from './type'

export const getInstitutionInvestors = (body: IInstitutionInvestorsParams) => {
  return ApiInstance.post('/com/search/top_investor', body)
}
export const getCompanyInformation = (body: ICompanyInformationParams) => {
  return ApiInstance.post('/com/search/top_company', body)
}

export const getPools = (body: IPoolsParams) => {
  return ApiInstance.post('/pools', body)
}
