import { Box, Typography } from '@mui/material'
import React from 'react'
import { useCountDown } from 'ahooks'
import { PoolStatus } from 'api/pool/type'

export interface PoolStatusBoxProps {
  status: PoolStatus
  openTime: number
  closeTime: number
  onEnd?: () => void
}

const PoolStatusBox = ({ status, openTime, closeTime, onEnd }: PoolStatusBoxProps): JSX.Element => {
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate:
      status === PoolStatus.Upcoming ? openTime * 1000 : status === PoolStatus.Live ? closeTime * 1000 : undefined,
    onEnd
  })

  switch (status) {
    case PoolStatus.Upcoming:
      return (
        <Box sx={{ px: 12, py: 4, bgcolor: '#E6E6E6', borderRadius: 20, display: 'flex' }}>
          <Typography variant="body1">Upcoming</Typography>
        </Box>
      )

    case PoolStatus.Live:
      return (
        <Box sx={{ px: 12, py: 4, bgcolor: '#D4F5DE', borderRadius: 20, display: 'flex' }}>
          <Typography variant="body1" color="#259C4A" component="span">
            Live
          </Typography>
          {countdown > 0 && (
            <Typography variant="body1" color="#259C4A" component="span">
              &nbsp;{days}d : {hours}h : {minutes}m : {seconds}s
            </Typography>
          )}
        </Box>
      )

    case PoolStatus.Closed:
    case PoolStatus.Cancelled:
      return (
        <Box sx={{ px: 12, py: 4, bgcolor: '#D6DFF6', borderRadius: 20 }}>
          <Typography variant="body1" color="#2663FF">
            Closed
          </Typography>
        </Box>
      )

    default:
      return null
  }
}

export default PoolStatusBox
