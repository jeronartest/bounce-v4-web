import { Alert, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const AllTokenAuctionedAlert = () => {
  return (
    <Alert sx={{ borderRadius: 20, bgcolor: '#E4FFEC' }} icon={<CheckCircleIcon sx={{ color: '#2DAB50' }} />}>
      <Typography variant="body1" component="span">
        All Tokens Auctioned.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        Congratulations! Your auction is complete. Claim fund raised
      </Typography>
    </Alert>
  )
}

export default AllTokenAuctionedAlert
