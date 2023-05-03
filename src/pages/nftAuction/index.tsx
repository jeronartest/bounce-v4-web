import { Box, Container } from '@mui/material'
import React, { useState } from 'react'
import FooterPc from 'components/Footer/FooterPc'
import TypesOfAuction from 'components/TypesOfAuction'
import ArrowBanner, { IBanner } from '../../bounceComponents/auction/ArrowBanner'
import Photo28 from '../../assets/imgs/company/banner/photo_28_banner.jpg'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import HeaderTab from 'bounceComponents/auction/HeaderTab'
// import { AuctionRankCard } from 'bounceComponents/common/AuctionCard/AuctionRankCard'
// import { ActiveUser } from 'bounceComponents/common/AuctionCard/AuctionActiveCard'
import NftListDialog from './components/listDialog'
import { Notable1155 } from '../../bounceComponents/auction/Notable1155'
import { Notable721 } from '../../bounceComponents/auction/Notable721'

const NFTAcution: React.FC = ({}) => {
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
      <Notable1155 />
      <Notable721 handleViewAll={handleOpen} />
      <FooterPc />
      <NftListDialog open={open} handleClose={handleClose} />
    </>
  )
}

export default NFTAcution
