import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const LivePoolCreatorAlert = () => {
  return (
    <Alert
      variant="outlined"
      icon={<ErrorIcon sx={{ color: '#171717' }} />}
      sx={{ borderRadius: 20, borderColor: '#D1D4D8' }}
    >
      <Typography variant="body1">
        You can only claim your fund raised after your auction is finished. There is a 2.5% platform feed charged
        automatically from fund raised.
      </Typography>
    </Alert>
  )
}

export default LivePoolCreatorAlert
