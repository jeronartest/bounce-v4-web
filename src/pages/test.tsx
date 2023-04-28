import { Box } from '@mui/material'
import HeaderTab from '../bounceComponents/market/components/HeaderTab'
import ArrowBanner, { IBanner } from '../bounceComponents/market/ArrowBanner'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import Photo28 from 'assets/imgs/company/banner/photo_28_banner.jpg'

export default function Test() {
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
    <Box>
      <HeaderTab onTabChange={tab => console.log(tab)} />
      <ArrowBanner list={testBanner} />
    </Box>
  )
}
