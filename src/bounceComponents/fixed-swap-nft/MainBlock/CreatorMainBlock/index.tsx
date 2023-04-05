import { Box } from '@mui/material'
import React from 'react'
import { BigNumber } from 'bignumber.js'
import CreatorActionBox from '../../ActionBox/CreatorActionBox'
import BottomBox from '../UserMainBlock/BottomBox'
import NotStartedAlert from '../../Alerts/NotStartedAlert'
import ClaimBackAlert from '../../Alerts/ClaimBackAlert'
import AllTokenAuctionedAlert from '../../Alerts/AllTokenAuctionedAlert'
import AuctionLiveAlert from '../../Alerts/AuctionLiveAlert'
import { NftCard, UserMainBlockParams } from '../UserMainBlock'
import { PoolStatus } from '@/api/pool/type'
import useIsAllTokenSwapped from '@/hooks/auction/useIsAllNftTokenSwapped'
import useNftGoApi from '@/hooks/auction/useNftInfoByNftGo'

const CreatorMainBlock = (props: UserMainBlockParams): JSX.Element => {
  const { poolInfo } = props

  const isAllTokenSwapped = useIsAllTokenSwapped()
  const nftGoInfo = useNftGoApi(poolInfo.contract, poolInfo.tokenId)
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

      <Box sx={{ display: 'flex', columnGap: 65, marginBottom: 30 }}>
        {/* <UserActionBox /> */}
        <NftCard nft={poolInfo} suspicious={!!nftGoInfo?.data?.suspicious} />
        <CreatorActionBox />
      </Box>
      <BottomBox />
    </Box>
  )
}

export default CreatorMainBlock
