import React from 'react'
import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { PoolStatus } from '@/api/pool/type'
import usePoolInfo from '@/hooks/auction/usePoolInfo'

const CreatorAlert = (): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()

  // if (!poolInfo) {
  //   return <h1>No PoolInfo in CreatorAlert</h1>
  // }

  return (
    <Alert
      variant="outlined"
      icon={<ErrorIcon sx={{ color: '#171717' }} />}
      sx={{ borderRadius: 20, borderColor: '#D1D4D8' }}
    >
      {poolInfo.status === PoolStatus.Upcoming && (
        <Typography variant="body1">
          After the start of the auction you can only claim your fund raised after your auction is finished. There is a
          2.5% platform feed charged automatically from fund raised.
        </Typography>
      )}

      {poolInfo.status === PoolStatus.Live && (
        <Typography variant="body1">
          You can only claim your fund raised after your auction is finished. There is a 2.5% platform feed charged
          automatically from fund raised.
        </Typography>
      )}
    </Alert>
  )
}

export default CreatorAlert
