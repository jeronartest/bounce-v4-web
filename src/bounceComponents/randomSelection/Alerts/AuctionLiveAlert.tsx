import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const AuctionLiveAlert = () => {
  return (
    <Alert icon={<ErrorIcon sx={{ color: '#171717' }} />} sx={{ borderRadius: 20, bgcolor: '#F5F5F5' }}>
      <Typography variant="body1" component="span">
        The auction is still live.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        Please wait patiently until your auction is filled or closed.
      </Typography>
    </Alert>
  )
}

export default AuctionLiveAlert
