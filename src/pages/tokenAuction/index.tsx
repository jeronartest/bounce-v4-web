import { Box, Container } from '@mui/material'
import FooterPc from 'components/Footer/FooterPc'
import TypesOfAuction from 'components/TypesOfAuction'
import HeaderTab from '../../bounceComponents/auction/HeaderTab'
import ArrowBanner from '../../bounceComponents/auction/ArrowBanner'
import { NotableAuction } from '../../bounceComponents/auction/NotableAuction'
import { UpcomingAuction } from '../../bounceComponents/auction/UpcomingAuction'
import PoolListDialog from './components/listDialog'
import React, { useState } from 'react'

const TokenAuctionPage: React.FC = ({}) => {
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
          <ArrowBanner type={'Token'} />
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
