import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import { getOptionsData } from '@/api/optionsData'

export const useOptionsData = () => {
  const dispatch = useDispatch()
  const { data: optionsData, run: getOpData } = useRequest(getOptionsData, {
    cacheKey: 'optionsData',
    onSuccess: (response) => {
      if (response.code === 200) {
        dispatch({
          type: 'configOptions/setOptionDatas',
          payload: {
            optionDatas: response.data,
          },
        })
        return response.data
      }
    },
  })
  return { optionsData, getOpData }
}
