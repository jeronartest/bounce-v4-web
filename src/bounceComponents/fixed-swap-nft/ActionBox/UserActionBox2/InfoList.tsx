import { Divider, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useCountDown } from 'ahooks'

import TokenImage from 'bounceComponents/common/TokenImage'
import DefaultNftIcon from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import { formatNumber } from 'utils/number'
import { useIsUserJoined1155Pool } from 'bounceHooks/auction/useIsUserJoinedPool'
import { shortenAddress } from 'utils'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'

const InfoList = (props: FixedSwapPoolParams) => {
  const { poolInfo, getPoolInfo } = props

  const formatedSwappedAmount0 = !poolInfo ? '-' : poolInfo?.participant.swappedAmount0 || '0'

  const isJoined = useIsUserJoined1155Pool(poolInfo)
  const isClaimmingDelayed = poolInfo.claimAt > poolInfo.closeAt
  const formattedClaimTime = moment(poolInfo.claimAt * 1000).format('MMM D, YYYY hh:mm A')

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: isClaimmingDelayed ? poolInfo.claimAt * 1000 : poolInfo.closeAt * 1000,
    onEnd: getPoolInfo
  })
  return (
    <>
      <Stack spacing={10} sx={{ mt: 24 }}>
        <PoolInfoItem title="Unit Price">
          <Stack direction="row" spacing={8}>
            <Typography>1</Typography>
            <TokenImage
              alt={poolInfo.token0.symbol}
              src={poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon}
              size={20}
            />
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
            <TokenImage
              alt={poolInfo.token0.symbol}
              src={poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon}
              size={20}
            />
            <Typography>{poolInfo.token0.symbol}</Typography>
          </Stack>
        </PoolInfoItem>

        <PoolInfoItem title="Creator wallet address">
          <Stack direction="row" spacing={6}>
            <Typography>{shortenAddress(poolInfo.creator)}</Typography>
            <CopyToClipboard text={poolInfo.creator} />
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
