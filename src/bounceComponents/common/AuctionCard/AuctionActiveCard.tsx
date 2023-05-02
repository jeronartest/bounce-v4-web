import { Box, styled, Typography } from '@mui/material'
import React from 'react'

const H5 = styled(Typography)`
  font-family: 'Public Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #121212;
`

const SmallText = styled(Typography)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: rgba(27, 27, 27, 0.4);
`

interface IAuctionActiveCard {
  img: string
  name: string
  desc: string
  createdCount: string
  participated: string
}

export const AuctionActiveCard: React.FC<IAuctionActiveCard> = props => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '16px',
        gap: '20px',
        background: '#FFFFFF',
        borderRadius: '20px'
      }}
    >
      <img
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '14px'
        }}
      />
      <Box>
        <Box>
          <H5>{props.name}</H5>
          <SmallText>{props.desc}</SmallText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '16px 20px',
            gap: '24px',
            width: '226px',
            height: '81px',
            background: '#F6F7F3',
            borderRadius: '6px'
          }}
        >
          <Box>
            <SmallText>Auction Created</SmallText>
            <H5>{props.createdCount}</H5>
          </Box>
          <Box>
            <SmallText>Participated</SmallText>
            <H5>{props.participated}</H5>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
