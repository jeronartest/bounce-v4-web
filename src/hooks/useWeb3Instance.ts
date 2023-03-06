import { useActiveWeb3React } from './index'
import Web3 from 'web3'
import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

export function useWeb3Instance() {
  const { active, library } = useActiveWeb3React()
  const [web3jsInstance, setWeb3jsInstance] = useState<Web3 | null>(null)

  useEffect(() => {
    if (library) {
      const instance = new Web3(Web3.givenProvider || (library.provider as provider))
      setWeb3jsInstance(instance)
    }
  }, [active, library])

  return web3jsInstance
}

export function useSignMessage() {
  const { account } = useActiveWeb3React()
  const web3 = useWeb3Instance()
  return useCallback(
    (message: string) => {
      if (!account || !web3) {
        throw new Error('account not find')
      }
      return web3?.eth.personal.sign(message, account, '')
    },
    [account, web3]
  )
}
