import { Box, Typography } from '@mui/material'
import Image from 'components/Image'
import ErrorSVG from 'assets/imgs/auction/error.svg'

const WrongNetworkAlert = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 8 }}>
      <Image src={ErrorSVG} alt="Error Icon" width={20} height={20} />
      <Typography variant="body2" sx={{ ml: 8 }}>
        Oops! Wrong network
      </Typography>
    </Box>
  )
}

export default WrongNetworkAlert
