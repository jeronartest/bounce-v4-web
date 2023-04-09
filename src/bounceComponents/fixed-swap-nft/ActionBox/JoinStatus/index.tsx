import { Typography } from '@mui/material'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'
import { useIsUserJoined1155Pool } from 'bounceHooks/auction/useIsUserJoinedPool'

const JoinStatus = (props: FixedSwapPoolParams) => {
  const isUserJoinedPool = useIsUserJoined1155Pool(props.poolInfo)

  return <Typography variant="h2">{isUserJoinedPool ? 'You Joined' : 'Join The Pool'}</Typography>
}

export default JoinStatus
