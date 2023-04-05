import usePoolWithParticipantInfo from './use1155PoolWithParticipantInfo'

const useIsUserClaimedPool = () => {
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  return poolWithParticipantInfo ? poolWithParticipantInfo?.participant.claimed : undefined
}
export default useIsUserClaimedPool
