export interface IInstitutionInvestorsParams {
  limit: number
  name: string
  offset: number
  startup: number
}

export interface ICompanyInformationParams {
  companyStage: number
  limit: number
  marketCategory: number
  name: string
  offset: number
  startup: number
}
export interface IPoolsParams {
  category: number
  chainId: number
  creatorAddress?: string
  creatorName?: string
  limit: number
  offset: number
  orderBy: string
  poolId?: string
  poolName?: string
  CreatorUserId?: number
  poolStatusFrontend?: string
  token0Address?: string
  tokenType?: number
}

export enum UserType {
  Profile = 1,
  Company = 0
}
