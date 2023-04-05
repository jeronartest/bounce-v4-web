import React from 'react'
import { Box } from '@mui/material'

import PoolStatusBox from '../PoolStatus'
import JoinStatus from '../JoinStatus'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'

const Header = () => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <JoinStatus />
      <PoolStatusBox
        status={poolInfo.status}
        openTime={poolInfo.openAt}
        closeTime={poolInfo.closeAt}
        onEnd={getPoolInfo}
      />
    </Box>
  )
}

export default Header
