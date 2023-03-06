import { createSlice } from '@reduxjs/toolkit'
import { IConfigResponse } from 'api/user/type'

export const configOptions = createSlice({
  name: 'configOptions',
  initialState: {
    optionDatas: {} as IConfigResponse
  },
  reducers: {
    setOptionDatas: (state, { payload }) => {
      state.optionDatas = payload.optionDatas
    }
  }
})

export default configOptions.reducer
