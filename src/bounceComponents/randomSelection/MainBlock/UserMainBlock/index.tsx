import { Box } from '@mui/material'

import LeftBox from '../../LeftBox'
import UserActionBox2 from '../../ActionBox/UserActionBox2'
import Alert from './Alert'
import { FixedSwapPoolProp } from 'api/pool/type'

const UserMainBlock = ({
  poolInfo,
  getPoolInfo
}: {
  poolInfo: FixedSwapPoolProp
  getPoolInfo: () => void
}): JSX.Element => {
  return (
    <Box
      sx={{ borderRadius: 20, px: 24, py: 20, bgcolor: '#fff', display: 'flex', flexDirection: 'column', rowGap: 12 }}
    >
      <Alert poolInfo={poolInfo} />
      <LeftBox poolInfo={poolInfo} />
      {/* <UserActionBox /> */}
      <UserActionBox2 poolInfo={poolInfo} getPoolInfo={getPoolInfo} />
    </Box>
  )
}

export default UserMainBlock
