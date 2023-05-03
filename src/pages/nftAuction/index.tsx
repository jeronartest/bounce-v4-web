import { Box, Container } from '@mui/material'
import React from 'react'
import FooterPc from 'components/Footer/FooterPc'
import TokenAuction from 'components/TokenAuction'
import TypesOfAuction from 'components/TypesOfAuction'
import Photo28 from '../../assets/imgs/company/banner/photo_28_banner.jpg'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import HeaderTab from '../../bounceComponents/auction/HeaderTab'
import { Notable1155 } from '../../bounceComponents/auction/Notable1155'
import ArrowBanner, { IBanner } from '../../bounceComponents/auction/ArrowBanner'
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
  return (
    <>
      <Container maxWidth="lg">
        <HeaderTab onTabChange={tab => console.log(tab)} />
        <Box mt={16}>
          <ArrowBanner list={testBanner} />
        </Box>
      </Container>
      <TokenAuction />
      <TypesOfAuction />
      <Notable1155 />
      <Notable721 />
      <FooterPc />
    </>
  )
}

export default NFTAcution
