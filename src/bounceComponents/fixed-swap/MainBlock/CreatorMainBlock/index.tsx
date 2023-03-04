import { Box } from '@mui/material'
import React from 'react'
import { BigNumber } from 'bignumber.js'
import CreatorActionBox from '../../ActionBox/CreatorActionBox'
import LeftBox from '../../LeftBox'
import NotStartedAlert from '../../Alerts/NotStartedAlert'
import ClaimBackAlert from '../../Alerts/ClaimBackAlert'
import AllTokenAuctionedAlert from '../../Alerts/AllTokenAuctionedAlert'
import AuctionLiveAlert from '../../Alerts/AuctionLiveAlert'
import { PoolStatus } from 'api/pool/type'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import useIsAllTokenSwapped from 'bounceHooks/auction/useIsAllTokenSwapped'

const CreatorMainBlock = (): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()

  const isAllTokenSwapped = useIsAllTokenSwapped()

  return (
    <Box
      sx={{ borderRadius: 20, px: 24, py: 20, bgcolor: '#fff', display: 'flex', flexDirection: 'column', rowGap: 12 }}
    >
      {poolInfo.status === PoolStatus.Upcoming && <NotStartedAlert />}
      {poolInfo.status === PoolStatus.Live && <AuctionLiveAlert />}
      {poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed && !isAllTokenSwapped && <ClaimBackAlert />}
      {poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed && isAllTokenSwapped && (
        <AllTokenAuctionedAlert />
      )}

      <Box sx={{ display: 'flex', columnGap: 12 }}>
        <LeftBox />
        <CreatorActionBox />
      </Box>
    </Box>
  )
}

export default CreatorMainBlock
