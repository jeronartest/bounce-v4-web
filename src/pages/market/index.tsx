import { Box, Container } from '@mui/material'
import React from 'react'
import FooterPc from 'components/Footer/FooterPc'
import TokenAuction from 'components/TokenAuction'
import HeaderTab from '../../bounceComponents/auction/HeaderTab'
import ArrowBanner from '../../bounceComponents/auction/ArrowBanner'
import { AuctionRankCard } from '../../bounceComponents/common/AuctionCard/AuctionRankCard'
import { ActiveUser } from '../../bounceComponents/common/AuctionCard/AuctionActiveCard'

const Market: React.FC = ({}) => {
  return (
    <>
      <Container maxWidth="lg">
        <HeaderTab onTabChange={tab => console.log(tab)} />
        <Box mt={16}>
          <ArrowBanner />
        </Box>
        <AuctionRankCard />
      </Container>
      <TokenAuction />
      <ActiveUser />
      <FooterPc />
    </>
  )
}

export default Market
