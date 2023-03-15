import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const ClaimBackAlert = () => {
  return (
    <Alert sx={{ borderRadius: 20 }} severity="error" icon={<ErrorIcon sx={{ color: '#FF0000' }} />}>
      <Typography variant="body1" component="span">
        Claim back your unswapped tokens and fund raised.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        Unfortunately, your pool is not fully filled and closed.
      </Typography>
    </Alert>
  )
}

export default ClaimBackAlert
