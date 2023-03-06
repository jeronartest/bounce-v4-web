import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { bindThirdpart } from 'api/user'
import { IBindThirdpartParams, USER_TYPE } from 'api/user/type'
import { fetchCompanyInfo, fetchUserInfo } from 'state/users/reducer'
import { useUserInfo } from 'state/users/hooks'

export const useBindThirdPart = () => {
  const dispatch = useDispatch()
  const { userType, userId } = useUserInfo()
  return useRequest(async (params: IBindThirdpartParams) => bindThirdpart(params), {
    manual: true,
    onSuccess: (data: any) => {
      const { code } = data
      if (code === 200) {
        if (userType === USER_TYPE.USER) {
          dispatch(
            fetchUserInfo({
              userId: userId
            })
          )
        } else {
          dispatch(
            fetchCompanyInfo({
              thirdpartId: 0,
              userId: userId
            })
          )
        }
      } else if (code === 10409 || code === 10419 || code === 10408) {
        toast.error('Your social accounts have been used, please bind the the other one.')
      } else {
        toast.error('Unknown system failure: Please try')
      }
    }
  })
}
