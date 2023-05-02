import { Swiper } from 'swiper/react'
import { SwiperProps, SwiperRef } from 'swiper/react/swiper-react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Box, styled } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useState } from 'react'
import SwiperCore, { Autoplay, Pagination } from 'swiper'
import * as React from 'react'

SwiperCore.use([Autoplay, Pagination])
import 'swiper/swiper-bundle.css'

interface ISlideProgress {
  swiperStyle: React.RefAttributes<SwiperRef> & SwiperProps
  children: ReactJSXElement[]
}

const ArrowBg = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 22px;
  width: 60px;
  height: 60px;
  background: #ffffff;
  border-radius: 8px;

  &:hover {
    background: #626262;
    color: white;
    cursor: pointer;
  }
`
const ProgressLight = styled(Box)`
  height: 4px;
  background: #e1f25c;
  border-radius: 4px;
`

const ProgressGray = styled(ProgressLight)`
  background: rgba(18, 18, 18, 0.06);
`

export function SlideProgress(props: ISlideProgress) {
  const { swiperStyle, children } = props
  const [swiper, setSwiper] = useState<SwiperCore>()
  const totalSlides = swiper?.slides.length ? swiper.slides.length : 1
  const [currentIndex, setCurrentIdx] = useState(swiperStyle.slidesPerView)
  return (
    <Box>
      <Swiper
        onSlideChange={s => {
          const endIdx = s?.realIndex ? s.realIndex + Number(s.params.slidesPerView) : Number(swiperStyle.slidesPerView)
          setCurrentIdx(endIdx > totalSlides ? totalSlides : endIdx)
        }}
        onSwiper={setSwiper}
        {...swiperStyle}
      >
        {children}
      </Swiper>
      <Box display={'flex'} alignItems={'center'} mt={34}>
        <ArrowBg onClick={() => swiper?.slidePrev(1)}>
          <ArrowBackIcon />
        </ArrowBg>
        <ArrowBg ml={8} mr={16} onClick={() => swiper?.slideNext(1)}>
          <ArrowForwardIcon />
        </ArrowBg>
        <Box display={'flex'} width={'100%'}>
          <ProgressLight width={`${(Number(currentIndex) / totalSlides) * 100}%`} />
          <ProgressGray width={`${((totalSlides - Number(currentIndex)) / totalSlides) * 100}%`} />
        </Box>
      </Box>
    </Box>
  )
}
