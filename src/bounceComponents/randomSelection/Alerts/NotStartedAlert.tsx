import { Alert, Typography } from '@mui/material'

const NotStartedAlert = () => {
  return (
    <Alert severity="warning" sx={{ borderRadius: 20 }}>
      <Typography variant="body1" component="span">
        The auction has not started yet.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        Please wait patiently until your auction starts.
      </Typography>
    </Alert>
  )
}

export default NotStartedAlert
