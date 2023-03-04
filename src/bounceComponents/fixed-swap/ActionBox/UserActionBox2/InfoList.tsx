import React from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useCountDown } from 'ahooks'

import PoolInfoItem from '../../PoolInfoItem'
import TokenImage from 'bounceComponents/common/TokenImage'
import { formatNumber } from '@/utils/web3/number'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import usePoolWithParticipantInfo from 'bounceHooks/auction/usePoolWithParticipantInfo'
import useIsUserJoinedPool from 'bounceHooks/auction/useIsUserJoinedPool'

const InfoList = () => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo, loading: isPoolWithParticipantInfoLoading } = usePoolWithParticipantInfo()

  const formatedSwappedAmount0 =
    !isPoolWithParticipantInfoLoading && !poolWithParticipantInfo
      ? '-'
      : // participant.swappedAmount0 from API could be empty string
      poolWithParticipantInfo?.participant.swappedAmount0
      ? formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
          unit: poolWithParticipantInfo.token0.decimals
        })
      : '0'

  const isJoined = useIsUserJoinedPool()
  const isClaimmingDelayed = poolInfo.claimAt > poolInfo.closeAt
  const formattedClaimTime = moment(poolInfo.claimAt * 1000).format('MMM D, YYYY hh:mm A')

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: isClaimmingDelayed ? poolInfo.claimAt * 1000 : poolInfo.closeAt * 1000,
    onEnd: getPoolInfo
  })

  return (
    <>
      <Stack spacing={10} sx={{ mt: 24 }}>
        <PoolInfoItem title="Bid swap ratio">
          <Stack direction="row" spacing={8}>
            <Typography>1</Typography>
            <TokenImage alt={poolInfo.token0.symbol} src={poolInfo.token0.largeUrl} size={20} />
            <Typography>
              {poolInfo.token0.symbol} = {formatNumber(poolInfo.ratio, { unit: 0 })}
            </Typography>
            <TokenImage alt={poolInfo.token1.symbol} src={poolInfo.token1.largeUrl} size={20} />
            <Typography>{poolInfo.token1.symbol}</Typography>
          </Stack>
        </PoolInfoItem>

        <PoolInfoItem title="Successful bid amount" tip="The amount of token you successfully secured.">
          <Stack direction="row" spacing={6}>
            <Typography>{formatedSwappedAmount0}</Typography>
            <TokenImage alt={poolInfo.token0.symbol} src={poolInfo.token0.largeUrl} size={20} />
            <Typography>{poolInfo.token0.symbol}</Typography>
          </Stack>
        </PoolInfoItem>

        {isClaimmingDelayed && <PoolInfoItem title="Delay Unlocking Token Date">{formattedClaimTime}</PoolInfoItem>}
      </Stack>

      {isJoined && countdown > 0 ? (
        <>
          <Divider sx={{ mt: 10, borderColor: '#E6E6E6' }} />
          <PoolInfoItem title="Claim token" sx={{ mt: 10 }}>
            <Typography>
              in {days}d : {hours}h : {minutes}m : {seconds}s
            </Typography>
          </PoolInfoItem>
        </>
      ) : null}
    </>
  )
}

export default InfoList
