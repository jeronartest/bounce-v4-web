import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const AuctionClosedAlert = () => {
  return (
    <Alert icon={<ErrorIcon sx={{ color: '#171717' }} />} sx={{ borderRadius: 20, bgcolor: '#F5F5F5' }}>
      <Typography variant="body1" component="span">
        Auction closed.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        This auction is finished, please browse other auction pools.
      </Typography>
    </Alert>
  )
}

export default AuctionClosedAlert
