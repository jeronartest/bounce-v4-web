import { Box, Container } from '@mui/material'
import React from 'react'
import FooterPc from 'components/Footer/FooterPc'
import TokenAuction from 'components/TokenAuction'
import TypesOfAuction from 'components/TypesOfAuction'
import ArrowBanner, { IBanner } from '../../bounceComponents/market/ArrowBanner'
import Photo28 from '../../assets/imgs/company/banner/photo_28_banner.jpg'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import HeaderTab from '../../bounceComponents/market/components/HeaderTab'

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
  return (
    <>
      <Container maxWidth="lg">
        <HeaderTab onTabChange={tab => console.log(tab)} />
        <Box mt={60}>
          <ArrowBanner list={testBanner} />
        </Box>
      </Container>
      <TokenAuction />
      <TypesOfAuction />
      <FooterPc />
    </>
  )
}

export default NFTAcution
