import { Alert, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ClaimYourTokenAlert = () => {
  return (
    <Alert sx={{ borderRadius: 20, bgcolor: '#E4FFEC' }} icon={<CheckCircleIcon sx={{ color: '#2DAB50' }} />}>
      <Typography variant="body1" component="span">
        Success!&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        You have successfully participated in this auction and bided for your tokens. Please claim your tokens.
      </Typography>
    </Alert>
  )
}

export default ClaimYourTokenAlert
