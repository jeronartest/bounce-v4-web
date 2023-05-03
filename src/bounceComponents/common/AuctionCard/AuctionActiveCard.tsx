import { Box, Container, styled } from '@mui/material'
import React from 'react'
import { H2, H5, SmallText } from '../../../components/Text'
import { SlideProgress } from '../../auction/SlideProgress'
import { SwiperSlide } from 'swiper/react'
import EmptyImg from 'assets/imgs/auction/empty-avatar.svg'

interface IAuctionActiveCard {
  img: string
  name: string
  desc: string
  createdCount: string
  participated: string
}

const YellowSpan = styled('span')`
  color: #c8f056;
`

const AuctionActiveCard: React.FC<IAuctionActiveCard> = props => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '16px',
        width: 'fit-content',
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
        src={props.img ? props.img : EmptyImg}
      />
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
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
            width: 'fit-content',
            height: 'fit-content',
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

export const ActiveUser: React.FC = () => {
  const fakeData: IAuctionActiveCard[] = [
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    },
    {
      img: '',
      name: 'Elon Must',
      desc: 'Individual Investor, Defi Player',
      createdCount: '25',
      participated: '12'
    }
  ]
  return (
    <Container
      style={{
        padding: '100px 0 140px'
      }}
    >
      <H2 mb={80}>
        Most active <YellowSpan>auctioneers</YellowSpan> and <YellowSpan>bidders</YellowSpan>
      </H2>
      <SlideProgress
        swiperStyle={{
          spaceBetween: 20,
          slidesPerView: 3.1,
          loop: false
        }}
      >
        {fakeData.map((data, idx) => (
          <SwiperSlide key={idx}>
            <AuctionActiveCard
              img={data.img}
              name={data.name}
              desc={data.desc}
              createdCount={data.createdCount}
              participated={data.participated}
            />
          </SwiperSlide>
        ))}
      </SlideProgress>
    </Container>
  )
}
