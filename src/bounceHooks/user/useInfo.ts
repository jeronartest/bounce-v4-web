import { useLocalStorageState } from 'ahooks'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { CACHE_USER_LOGININFO, ICacheLoginInfo } from './useLogin'
import { fetchCompanyInfo, fetchUserInfo, saveLoginInfo } from 'store/user'
import { USER_TYPE } from 'api/user/type'

export const useInfo = () => {
  const dispatch = useDispatch()
  const [cacheLoginInfo] = useLocalStorageState<ICacheLoginInfo>(CACHE_USER_LOGININFO)
  useEffect(() => {
    if (cacheLoginInfo) {
      dispatch(
        saveLoginInfo({
          token: cacheLoginInfo.token,
          userId: cacheLoginInfo.userId,
          userType: cacheLoginInfo.userType
        })
      )
      if (cacheLoginInfo.userId) {
        if (cacheLoginInfo.userType === USER_TYPE.USER) {
          dispatch(fetchUserInfo({ userId: cacheLoginInfo.userId }))
        } else {
          dispatch(fetchCompanyInfo({ thirdpartId: 0, userId: cacheLoginInfo.userId }))
        }
      }
    }
  }, [dispatch, cacheLoginInfo])
}
