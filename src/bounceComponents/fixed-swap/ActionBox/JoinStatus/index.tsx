import React from 'react'
import { Typography } from '@mui/material'

import useIsUserJoinedPool from '@/hooks/auction/useIsUserJoinedPool'

const JoinStatus = () => {
  const isUserJoinedPool = useIsUserJoinedPool()

  return <Typography variant="h2">{isUserJoinedPool ? 'You Joined' : 'Join The Pool'}</Typography>
}

export default JoinStatus
