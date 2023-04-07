import { Box } from '@mui/material'

import InfoList from './InfoList'
import ActionBlock from './ActionBlock'
import Header from 'bounceComponents/fixed-swap/Header'
import { FixedSwapNFTPoolProp } from 'api/pool/type'

const UserActionBox2 = ({ poolInfo }: { poolInfo: FixedSwapNFTPoolProp }) => {
  return (
    <Box sx={{ flex: 1, pt: 28 }}>
      <Header poolInfo={poolInfo} />
      <InfoList />
      <ActionBlock />
    </Box>
  )
}

export default UserActionBox2
