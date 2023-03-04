import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const useReloadOnChange = () => {
  const router = useRouter()

  const { address: account } = useAccount({
    onConnect: () => {
      console.log('>>>>>> account changed')
      // router.reload()
    },
  })
}

export default useReloadOnChange
