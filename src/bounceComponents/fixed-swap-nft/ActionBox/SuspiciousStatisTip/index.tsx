/* eslint-disable react/react-in-jsx-scope */
import { Box, Typography } from '@mui/material'
import { ReactComponent as SuspiciousIcon } from 'assets/imgs/auction/suspicious.svg'

function SuspiciousTips() {
  return (
    <Box
      sx={{
        width: '100%',
        background: '#FFF4F5',
        borderRadius: '20px',
        padding: '16px 20px 20px',
        marginTop: '17px'
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Sharp Grotesk DB Cyr Book 20',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '17px',
          color: '#F53030',
          marginBottom: '10px'
        }}
      >
        <SuspiciousIcon
          style={{
            marginRight: '8px',
            verticalAlign: 'middle'
          }}
        />
        Warning.
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Sharp Grotesk DB Cyr Book 20',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '17px',
          color: '#908E96'
        }}
      >
        {`This NFT doesn't appear on the active NFT lists. Make sure this is the token that you want to trade.`}
      </Typography>
    </Box>
  )
}

export default SuspiciousTips
