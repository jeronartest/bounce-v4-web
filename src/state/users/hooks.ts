import { useRequest } from 'ahooks'

import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useLinkedIn } from 'react-linkedin-login-oauth2'
import { login, logout } from 'api/user'
import { ACCOUNT_TYPE, ILoginParams } from 'api/user/type'
import { fetchUserInfo, saveLoginInfo, removeUserInfo } from 'state/users/reducer'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { routes } from 'constants/routes'

export const hellojs = typeof window !== 'undefined' ? require('hellojs') : null
export type IAuthName = 'google' | 'twitter'

export const useLogin = (path?: string) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return useRequest((params: ILoginParams) => login(params), {
    manual: true,
    onSuccess: async response => {
      const { code, data } = response
      if (code === 10412) {
        return toast.error('Incorrect password')
      }
      if (code === 10401) {
        return toast.error('Incorrect Account')
      }
      if (code === 10457) {
        return toast.error(
          'Your account already exists. For Metalents users who log in to Bounce for the first time, please click Forgot Password to verify your email.'
        )
      }
      if (code === 10406 || code === 10418 || code === 10407) {
        return toast.error('Sorry, your account has not been registered yet. Please register first.')
      }
      if (code !== 200) {
        return toast.error('Login fail')
      }
      toast.success('Welcome to Bounce')
      dispatch({
        type: 'users/saveLoginInfo',
        payload: {
          token: data?.token,
          userId: data?.userId,
          userType: data?.userType
        }
      })
      const res = await dispatch(
        fetchUserInfo({
          userId: data?.userId
        })
      )
      if (path) {
        return navigate(path)
      }
      if (res.payload?.avatar?.fileUrl) {
        navigate(routes.account.myProfile)
      } else {
        navigate(routes.account.dashboard)
      }
    }
  })
}

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    dispatch(
      saveLoginInfo({
        token: '',
        userId: '',
        userType: ''
      })
    )
    dispatch(removeUserInfo())
    navigate(`${routes.login}?path=${location.pathname}${location.search}`)
  }
  return { logout: handleLogout }
}

export const useOauth = () => {
  hellojs?.init(
    {
      google: '117868071955-dkealrsgucq1bkcmu5u6cljmko7i90b8.apps.googleusercontent.com',
      twitter: 'Lcxb7E1quXZ8ltUcKK1BKkdeQ'
    },
    {
      redirect_uri: '/'
    }
  )
  const handleOauth = async (oauthName: string) => {
    const response = await hellojs(oauthName).login({ scope: 'email' })
    return response?.authResponse?.access_token
  }
  return {
    handleOauth
  }
}

export const useLinkedInOauth = (onChange: (accessToken: string, oauthType: ACCOUNT_TYPE) => void) => {
  const { linkedInLogin } = useLinkedIn({
    clientId: '86tbcvp8g3jtq0',
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/linkedin` : '',
    scope: 'r_emailaddress r_liteprofile',
    onSuccess: async (code: string) => {
      onChange(code, ACCOUNT_TYPE.LINKEDIN)
    }
  })
  return { linkedInLogin }
}

export function useUserInfo() {
  const userInfo = useSelector<AppState, AppState['users']>(state => state.users)
  return userInfo
}
