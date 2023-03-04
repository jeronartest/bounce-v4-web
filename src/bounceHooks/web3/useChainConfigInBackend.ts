import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'
import { ChainInfoOpt } from 'api/user/type'

const useChainConfigInBackend = (searchKey: keyof ChainInfoOpt, searchValue: any) => {
  const optionDatas = useSelector((state: RootState) => state.configOptions.optionDatas)

  return useMemo(() => {
    if (!optionDatas?.chainInfoOpt) return null

    return optionDatas.chainInfoOpt.find((chainInfo) => chainInfo?.[searchKey] === searchValue)
  }, [searchKey, searchValue, optionDatas.chainInfoOpt])
}

export default useChainConfigInBackend
