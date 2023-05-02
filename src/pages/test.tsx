import { Box, Button } from '@mui/material'
import HeaderTab from '../bounceComponents/market/components/HeaderTab'
import ArrowBanner, { IBanner } from '../bounceComponents/market/ArrowBanner'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import Photo28 from 'assets/imgs/company/banner/photo_28_banner.jpg'
import { SlideProgress } from '../bounceComponents/market/components/SlideProgress'
import { SwiperSlide } from 'swiper/react'
import { useState } from 'react'
import { DropDown, DropDownItem } from '../bounceComponents/market/components/DropDown'

export default function Test() {
  const [select, setSelect] = useState('All auction')
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
  const testSelect = ['All auction', 'Fixed-priced Auction', 'English Auction', 'Dutch Auction']
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
    <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
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
      <DropDown
        value={select}
        onChange={e => setSelect(String(e.target.value))}
        sx={{
          '& .MuiList-root-MuiMenu-list': {
            fontSize: 48
          },
          '& .MuiMenuItem-root': {
            fontSize: 48
          },
          '& .Mui-selected': {
            fontSize: 48
          },
          '& .MuiButtonBase-root': {
            fontSize: 48
          }
        }}
      >
        {testSelect.map((s, idx) => (
          <DropDownItem
            sx={{
              '& .MuiList-root-MuiMenu-list': {
                fontSize: 48
              },
              '& .MuiMenuItem-root': {
                fontSize: 48
              },
              '& .Mui-selected': {
                fontSize: 48
              },
              '& .MuiButtonBase-root-MuiMenuItem-root': {
                fontSize: 48
              }
            }}
            key={idx}
            value={s}
          >
            {s}
          </DropDownItem>
        ))}
      </DropDown>
    </Box>
  )
}
