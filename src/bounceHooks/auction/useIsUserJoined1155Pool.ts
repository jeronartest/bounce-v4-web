import { useMemo } from 'react'
import usePoolWithParticipantInfo from './use1155PoolWithParticipantInfo'

const useIsUserJoinedPool = () => {
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  return useMemo(() => {
    if (!poolWithParticipantInfo) return undefined
    return (
      poolWithParticipantInfo?.participant &&
      poolWithParticipantInfo?.participant.swappedAmount0 !== '' &&
      poolWithParticipantInfo?.participant.swappedAmount0 !== '0'
    )
  }, [poolWithParticipantInfo])
}

export default useIsUserJoinedPool
