import usePoolWithParticipantInfo from './usePoolWithParticipantInfo'

const useIsUserClaimedPool = () => {
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  return poolWithParticipantInfo ? poolWithParticipantInfo?.participant.claimed : undefined
}
export default useIsUserClaimedPool
