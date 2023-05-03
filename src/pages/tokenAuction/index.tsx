import { Box, Container } from '@mui/material'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import FooterPc from 'components/Footer/FooterPc'
import TypesOfAuction from 'components/TypesOfAuction'
import HeaderTab from '../../bounceComponents/auction/HeaderTab'
import Photo28 from '../../assets/imgs/company/banner/photo_28_banner.jpg'
import ArrowBanner, { IBanner } from '../../bounceComponents/auction/ArrowBanner'
import { NotableAuction } from '../../bounceComponents/auction/NotableAuction'
import { UpcomingAuction } from '../../bounceComponents/auction/UpcomingAuction'
import PoolListDialog from './components/listDialog'
import React, { useState } from 'react'

const TokenAuctionPage: React.FC = ({}) => {
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
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <>
      <Container maxWidth="lg">
        <HeaderTab onTabChange={tab => console.log(tab)} />
        <Box mt={16}>
          <ArrowBanner list={testBanner} />
        </Box>
      </Container>
      <TypesOfAuction />
      <NotableAuction />
      <UpcomingAuction handleViewAll={handleOpen} />
      <FooterPc />
      <PoolListDialog open={open} handleClose={handleClose} />
    </>
  )
}

export default TokenAuctionPage
