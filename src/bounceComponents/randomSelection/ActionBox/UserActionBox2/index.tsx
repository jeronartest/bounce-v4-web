import { Box } from '@mui/material'

import Header from './Header'
import ActionBlock from './ActionBlock'
import { FixedSwapPoolProp } from 'api/pool/type'

const UserActionBox2 = ({ poolInfo, getPoolInfo }: { poolInfo: FixedSwapPoolProp; getPoolInfo: () => void }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '444px', margin: '0 auto', flex: 1, pt: 28 }}>
      <Header poolInfo={poolInfo} getPoolInfo={getPoolInfo} />
      <ActionBlock poolInfo={poolInfo} getPoolInfo={getPoolInfo} />
    </Box>
  )
}

export default UserActionBox2
