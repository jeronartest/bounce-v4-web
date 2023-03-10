import { Box, Typography } from '@mui/material'

import PoolStatusBox from '../PoolStatus'
import UpcomingPoolCreatorAlert from '../../Alerts/UpcomingPoolCreatorAlert'
import LivePoolCreatorAlert from '../../Alerts/LivePoolCreatorAlert'
import SuccessfullyClaimedAlert from '../../Alerts/SuccessfullyClaimedAlert'
import FundInfoList from './FundInfoList'
import ButtonBlock from './ButtonBlock'
import { PoolStatus } from 'api/pool/type'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'

const CreatorActionBox = (): JSX.Element => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  return (
    <Box sx={{ flex: 1, pt: 28 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">My Pool</Typography>
        <PoolStatusBox
          status={poolInfo.status}
          openTime={poolInfo.openAt}
          closeTime={poolInfo.closeAt}
          onEnd={getPoolInfo}
        />
      </Box>

      <FundInfoList />

      <ButtonBlock />

      {poolInfo.status === PoolStatus.Upcoming && <UpcomingPoolCreatorAlert />}
      {poolInfo.status === PoolStatus.Live && <LivePoolCreatorAlert />}
      {(poolInfo.status === PoolStatus.Closed || poolInfo.status === PoolStatus.Cancelled) &&
        poolInfo.creatorClaimed && <SuccessfullyClaimedAlert />}
    </Box>
  )
}

export default CreatorActionBox
