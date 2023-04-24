import { Box } from '@mui/material'

import Header from './Header'
import ActionBlock from './ActionBlock'
import { FixedSwapPoolProp } from 'api/pool/type'
import { useIsJoinedRandomSelectionPool } from 'hooks/useCreateRandomSelectionPool'
import { useActiveWeb3React } from 'hooks'

const UserActionBox2 = ({ poolInfo, getPoolInfo }: { poolInfo: FixedSwapPoolProp; getPoolInfo: () => void }) => {
  const { account } = useActiveWeb3React()
  const isJoined = useIsJoinedRandomSelectionPool(Number(poolInfo.poolId), account || undefined)
  console.log('isJoined>>>', isJoined)
  return (
    <Box sx={{ width: '100%', maxWidth: '444px', margin: '0 auto', flex: 1, pt: 28 }}>
      <Header poolInfo={poolInfo} getPoolInfo={getPoolInfo} isJoined={isJoined} />
      <ActionBlock poolInfo={poolInfo} getPoolInfo={getPoolInfo} isJoined={isJoined} />
    </Box>
  )
}

export default UserActionBox2
