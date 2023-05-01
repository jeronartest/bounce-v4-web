import { Box, Button } from '@mui/material'
import HeaderTab from '../bounceComponents/market/components/HeaderTab'
import ArrowBanner, { IBanner } from '../bounceComponents/market/ArrowBanner'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import Photo28 from 'assets/imgs/company/banner/photo_28_banner.jpg'
import { SlideProgress } from '../bounceComponents/market/components/SlideProgress'
import { SwiperSlide } from 'swiper/react'

export default function Test() {
  const testBanner: IBanner[] = [
    {
      title: 'Austin McBroom: Lover and Fighter',
      tag: ['NFT', 'English auction', '23.00 BNB'],
      countDown: '1682833200',
      pic: MarketPNG
    },
    {
      title: 'Austin McBroom: Lover and Fighter',
      tag: ['NFT', 'English auction', '23.00 BNB'],
      countDown: '1682833200',
      pic: Photo28
    }
  ]
  const btn = [1, 2, 3, 4, 5].map(idx => (
    <SwiperSlide key={idx}>
      <Button
        sx={{
          padding: '16px',
          width: '428px',
          height: '182px',
          background: '#d9d5d5',
          borderRadius: '20px'
        }}
      >
        {idx}
      </Button>
    </SwiperSlide>
  ))
  console.log('btn', btn)
  return (
    <Box>
      <HeaderTab onTabChange={tab => console.log(tab)} />
      <ArrowBanner list={testBanner} />
      <SlideProgress
        swiperStyle={{
          spaceBetween: 20,
          slidesPerView: 3.5,
          loop: false
        }}
      >
        {btn}
      </SlideProgress>
    </Box>
  )
}
