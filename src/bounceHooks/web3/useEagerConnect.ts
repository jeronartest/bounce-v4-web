import { useEffect } from 'react'

import { useClient, useConnect } from 'wagmi'

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    const connectorInstance = connectors.find((c) => c.ready)
    if (connectorInstance) {
      connectAsync({ connector: connectorInstance }).catch(() => {
        client.autoConnect()
      })
    } else {
      client.autoConnect()
    }
  }, [client, connectAsync, connectors])
}

export default useEagerConnect
