import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { useLogin } from './useLogin'
import { register } from 'api/user'
import { IRegisterParams } from 'api/user/type'

export const useRegister = () => {
  const { runAsync: runLogin } = useLogin()
  return useRequest((params: IRegisterParams) => register(params), {
    manual: true,
    onSuccess: (response, params: IRegisterParams[]) => {
      const { code, data } = response
      if (code === 10439) {
        return toast.error(
          'Your email are not eligible for this early bird registration. Please enter the correct email address.'
        )
      }
      if (code === 10409 || code === 10419 || code === 10408) {
        return toast.error('Your account has been registered, please login')
      }
      if (code !== 200) {
        return toast.error('Signup Fail')
      }
      return runLogin({
        accessToken: data?.accessToken || params[0].accessToken,
        email: params[0].email,
        loginType: params[0].registerType,
        password: params[0].password
      })
    }
  })
}
