import { Alert, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const AuctionFilledAlert = () => {
  return (
    <Alert icon={<ErrorIcon sx={{ color: '#171717' }} />} sx={{ borderRadius: 20, bgcolor: '#F5F5F5' }}>
      <Typography variant="body1" component="span">
        Auction filled.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        This auction is finished, please claim your token.
      </Typography>
    </Alert>
  )
}

export default AuctionFilledAlert
