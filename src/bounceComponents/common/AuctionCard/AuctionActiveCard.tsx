import { Box } from '@mui/material'
import React from 'react'
import { H5, SmallText } from '../../../components/Text'

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
