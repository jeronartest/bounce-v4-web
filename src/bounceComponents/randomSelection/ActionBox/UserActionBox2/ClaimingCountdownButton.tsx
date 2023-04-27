import { useCountDown } from 'ahooks'
import { Box, Button, Typography } from '@mui/material'

const ClaimingCountdownButton = ({ claimAt, getPoolInfo }: { claimAt: number; getPoolInfo?: () => void }) => {
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: claimAt * 1000,
    onEnd: getPoolInfo
  })

  return (
    <Button variant="contained" fullWidth sx={{ px: 36 }} disabled>
      <Box
        sx={{
          display: 'flex',
          justifyContent: countdown > 0 ? 'space-between' : 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Typography component="span">Claim Token</Typography>
        {countdown > 0 && (
          <Typography component="span">
            {days}d : {hours}h : {minutes}m : {seconds}s
          </Typography>
        )}
      </Box>
    </Button>
  )
}

export default ClaimingCountdownButton
