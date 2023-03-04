import { Box, Stack, Typography, styled } from '@mui/material'
import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Pagination } from 'swiper'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Autoplay, Pagination])
export interface ICompanyBannerProps {
  img: StaticImageData
  title: string
}
export interface ICompanyBanneListrProps {
  list: ICompanyBannerProps[]
}
const SwiperStyle = styled(Swiper)(() => ({
  '.swiper-pagination': {
    bottom: '32px !important',
    right: 0,
    left: '735px !important',
    width: 'auto !important',
    textAlign: 'left !important',
    paddingLeft: '40px !important',
  },
  '.swiper-pagination-bullet': {
    width: '16px',
    height: '16px',
  },
  '.swiper-pagination-bullet-active': {
    width: '36px',
    height: '16px',
    borderRadius: '16px',
    background: '#2663FF',
  },
}))
const CompanyBanner: React.FC<ICompanyBanneListrProps> = ({ list }) => {
  return (
    <SwiperStyle
      spaceBetween={20}
      slidesPerView={1}
      loop
      autoplay={{
        delay: 3000,
      }}
      pagination={{ clickable: true }}
    >
      {list?.map((item, index) => (
        <SwiperSlide key={index}>
          <Stack
            key={index}
            direction={'row'}
            height={420}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <Image src={item.img} alt="" height={420} />
            <Box sx={{ p: '60px 40px 32px', background: '#FFFFFF', width: 465 }}>
              <Typography variant="h1" sx={{ fontSize: 34 }}>
                {item.title}
              </Typography>
            </Box>
          </Stack>
        </SwiperSlide>
      ))}
    </SwiperStyle>
  )
}

export default CompanyBanner
