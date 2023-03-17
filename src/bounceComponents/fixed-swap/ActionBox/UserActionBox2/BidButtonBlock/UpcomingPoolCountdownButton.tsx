import { Box, Button, Typography } from '@mui/material'
import { useCountDown } from 'ahooks'

export interface UpcomingPoolCountdownButtonProps {
  openAt: number
}

const UpcomingPoolCountdownButton = ({ openAt }: UpcomingPoolCountdownButtonProps) => {
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: openAt * 1000
  })

  return (
    <Button variant="contained" fullWidth sx={{ mt: 24, mb: 12, px: 40 }} disabled>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: countdown > 0 ? 'space-between' : 'center'
        }}
      >
        <Typography component="span" sx={{ width: 'fit-content' }}>
          Place a Bid
        </Typography>

        {countdown > 0 ? (
          <Typography component="span">
            {days}d : {hours}h : {minutes}m : {seconds}s
          </Typography>
        ) : null}
      </Box>
    </Button>
  )
}

export default UpcomingPoolCountdownButton
