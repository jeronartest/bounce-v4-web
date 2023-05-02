import { Box, Container } from '@mui/material'
import React from 'react'
import CompanyBanner from 'bounceComponents/company/CompanyBanner'
import CompanyBanner3 from 'assets/imgs/company/banner/banner1.png'
import CompanyBanner4 from 'assets/imgs/company/banner/banner2.png'
import CompanyBanner5 from 'assets/imgs/company/banner/banner3.png'
import Banner28 from 'assets/imgs/company/banner/photo_28_banner.jpg'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import FooterPc from 'components/Footer/FooterPc'
import TokenAuction from 'components/TokenAuction'
import TypesOfAuction from 'components/TypesOfAuction'

const TokenAuctionPage: React.FC = ({}) => {
  const bannerList = [
    {
      img: Banner28,
      title: 'Bounce Finance Supports Polygon zkEVM for On-Chain Auctions'
    },
    {
      img: MarketPNG,
      title: 'Explore the market place & participate in Auctions'
    },
    // {
    //   img: CompanyBanner2,
    //   title: 'Explore everything about  companies and investors in one place',
    // },
    {
      img: CompanyBanner3,
      title: 'Build any type of auction with any tokens permissionlessly'
    },
    {
      img: CompanyBanner4,
      title: 'Launch your NFT through Bounce and activate differernt auction tools'
    },
    {
      img: CompanyBanner5,
      title: 'Bounce Token to boost your market'
    }
  ]
  return (
    <>
      <Container maxWidth="lg">
        <Box mt={60}>
          <CompanyBanner list={bannerList} />
        </Box>
      </Container>
      <TokenAuction />
      <TypesOfAuction />
      <FooterPc />
    </>
  )
}

export default TokenAuctionPage
