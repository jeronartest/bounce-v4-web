import { ApiInstance } from '..'
import {
  IActivitiesTotalParams,
  IGetBasicInvestmentsParams,
  IPoolFixedSwapParams,
  IupdateBasicParams,
  IUpdatePersonalParams,
  IUserPoolsParams
} from './type'

// update profile basic
export const updateBasic = (body: IupdateBasicParams) => {
  return ApiInstance.post('/personal/update', body)
  // return ApiInstance.post('/personal/update_basic', body)
}

// update profile info
export const updatePersonal = (body: IUpdatePersonalParams) => {
  return ApiInstance.post('/personal/update_resume', body)
}

// get profile Investments info
export const getBasicInvestments = (body: IGetBasicInvestmentsParams) => {
  return ApiInstance.post('/personal/invest', body)
}

// get profile worker history
export const getResumeExperience = (body: IGetBasicInvestmentsParams) => {
  return ApiInstance.post('/personal/experience', body)
}

// get profile Education history
export const getResumeEducation = (body: IGetBasicInvestmentsParams) => {
  return ApiInstance.post('/personal/education', body)
}
export const getUserActivitiesPool = async (params: IUserPoolsParams) => {
  return ApiInstance.post('/user/profile/pools', params)
}
export const getUserPoolsFixedSwap = async (params: IPoolFixedSwapParams) => {
  return ApiInstance.post('/user/pools/fixed_swap', params)
}

export const getUserPoolsFixedSwapNft = async (params: IPoolFixedSwapParams) => {
  return ApiInstance.post('/user/pools/fixed_swap_nft', params)
}

export const getActivitiesTotal = async (params: IActivitiesTotalParams) => {
  return ApiInstance.post('/user/activities', params)
}
