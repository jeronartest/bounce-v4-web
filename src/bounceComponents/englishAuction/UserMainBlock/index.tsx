import { Box, Stack, Typography } from '@mui/material'
import Alert from './Alert'
import { useEnglishAuctionPoolInfo } from 'pages/auction/englishAuctionNFT/ValuesProvider'
import TopInfoBox from '../TopInfoBox'
import PoolStatusBox from 'bounceComponents/fixed-swap/ActionBox/PoolStatus'

const UserMainBlock = (): JSX.Element => {
  const { data: poolInfo, run: getPoolInfo } = useEnglishAuctionPoolInfo()
  const isUserJoinedPool = false

  if (!poolInfo) return <></>

  return (
    <Stack sx={{ borderRadius: 20, px: 24, py: 20, bgcolor: '#fff' }} spacing={24}>
      <Alert poolInfo={poolInfo} />

      <TopInfoBox />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 20 }}>
        <Typography variant="h2">{isUserJoinedPool ? 'You Joined' : 'Join The Pool'}</Typography>

        {poolInfo && (
          <PoolStatusBox
            status={poolInfo.status}
            claimAt={poolInfo.claimAt}
            openTime={poolInfo.openAt}
            closeTime={poolInfo.closeAt}
            onEnd={getPoolInfo}
          />
        )}
      </Box>
    </Stack>
  )
}

export default UserMainBlock
