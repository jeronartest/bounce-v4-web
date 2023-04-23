import { Box, Stack, Typography } from '@mui/material'
import { PoolStatus } from 'api/pool/type'
import { useMemo } from 'react'
import NotStartedAlert from 'bounceComponents/fixed-swap/Alerts/NotStartedAlert'
import AuctionLiveAlert from 'bounceComponents/fixed-swap/Alerts/AuctionLiveAlert'
import ClaimBackAlert from 'bounceComponents/fixed-swap/Alerts/ClaimBackAlert'
import AllTokenAuctionedAlert from 'bounceComponents/fixed-swap/Alerts/AllTokenAuctionedAlert'
import { useEnglishAuctionPoolInfo } from 'pages/auction/englishAuctionNFT/ValuesProvider'
import TopInfoBox from '../TopInfoBox'
import PoolStatusBox from 'bounceComponents/fixed-swap/ActionBox/PoolStatus'

const CreatorMainBlock = (): JSX.Element => {
  const { data: poolInfo, run: getPoolInfo } = useEnglishAuctionPoolInfo()
  const isAllTokenSwapped = useMemo(
    () => Number(poolInfo?.swappedAmount0) >= Number(poolInfo?.amountTotal0),
    [poolInfo]
  )

  if (!poolInfo) return <></>

  return (
    <Stack sx={{ borderRadius: 20, px: 24, py: 20, bgcolor: '#fff' }} spacing={24}>
      {poolInfo.status === PoolStatus.Upcoming && <NotStartedAlert />}
      {poolInfo.status === PoolStatus.Live && <AuctionLiveAlert />}
      {poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed && !isAllTokenSwapped && <ClaimBackAlert />}
      {poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed && isAllTokenSwapped && (
        <AllTokenAuctionedAlert />
      )}
      <TopInfoBox />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 20 }}>
        <Typography variant="h2">My Pool</Typography>
        <PoolStatusBox
          status={poolInfo.status}
          openTime={poolInfo.openAt}
          closeTime={poolInfo.closeAt}
          claimAt={poolInfo.claimAt}
          onEnd={getPoolInfo}
        />
      </Box>
    </Stack>
  )
}

export default CreatorMainBlock
