import { Box } from '@mui/material'
import HeaderTab from '../bounceComponents/market/components/HeaderTab'

export default function Test() {
  return (
    <Box>
      <HeaderTab onTabChange={tab => console.log(tab)} />
    </Box>
  )
}
