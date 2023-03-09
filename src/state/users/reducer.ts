import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IUserInfoParams, USER_TYPE } from 'api/user/type'
import { getUserInfo } from 'api/user'
import { ICompanyInfoParams } from 'api/company/type'
import { getCompanyInfo } from 'api/company'

export interface ICacheLoginInfo {
  token: string
  userId: string | number
  userType: USER_TYPE | string
}

export const fetchUserInfo: any = createAsyncThunk('users/fetchUserInfo', async (params: IUserInfoParams) => {
  const res = await getUserInfo(params)
  return res.data
})

export const fetchCompanyInfo: any = createAsyncThunk('users/fetchCompanyInfo', async (params: ICompanyInfoParams) => {
  const res = await getCompanyInfo(params)
  return res.data
})

const initialState: ICacheLoginInfo & {
  userInfo: any
  companyInfo: any
} = {
  token: '',
  userId: 0,
  userType: 0,
  userInfo: null,
  companyInfo: null
}

export const userInfoSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    saveLoginInfo: (state, { payload }) => {
      state.token = payload.token
      state.userId = payload.userId
      state.userType = payload.userType
    },
    removeLoginInfo: state => {
      state.token = ''
      state.userId = 0
      state.userType = ''
    },
    removeUserInfo: state => {
      state.userInfo = null
      state.companyInfo = null
    }
  },
  extraReducers: {
    [fetchUserInfo.fulfilled]: (state, { payload }) => {
      state.userInfo = { ...payload }
    },
    [fetchCompanyInfo.fulfilled]: (state, { payload }) => {
      state.companyInfo = { ...payload }
    }
  }
})

export const { saveLoginInfo, removeUserInfo, removeLoginInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
