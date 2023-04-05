import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { show } from '@ebay/nice-modal-react'
import { useCountDown } from 'ahooks'
import moment from 'moment'
import PoolStatusBox from '../PoolStatus'
import PoolInfoItem from '../../PoolInfoItem'
import ParticipationConfirmation from '../ParticipationConfirmation'
import SuccessfullyClaimedAlert from '../../Alerts/SuccessfullyClaimedAlert'
import SwitchNetworkButton from '../../SwitchNetworkButton'
import RefundBlock from './RefundBlock'
import BidBlock from './BidBlock'
import BidOrRegretBlock from './BidOrRegretBlock'
import ClaimButton from './ClaimButton'
import DefaultNftIcon from '@/components/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'
import TokenImage from '@/components/common/TokenImage'
import { PoolStatus } from '@/api/pool/type'
import { formatNumber } from '@/utils/web3/number'
import ConnectWalletDialog from '@/components/common/ConnectWalletDialog'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'
import ErrorSVG from 'assets/imgs/icon/error_outline.svg'

const ConnectWalletButton = () => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ my: 12 }}
      onClick={() => {
        show(ConnectWalletDialog)
      }}
    >
      Connect Wallet
    </Button>
  )
}

export type ActionState =
  | 'Bid_Or_Regret'
  | 'To_Confirm_Notice'
  | 'Confirm_Notice'
  | 'Bid'
  | 'Input_Refund_Amount'
  | 'Confirm_Refund'
  | 'Not_Joined'

const UserActionBox = (): JSX.Element => {
  const { isConnected, address: account } = useAccount()
  const { chain } = useNetwork()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const isJoined =
    poolWithParticipantInfo?.participant &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '' &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '0'

  const isClaimmingDelayed = poolInfo.claimAt > poolInfo.closeAt

  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)
  const chainOfPool = chainConfig.ethChainId
  const isCurrentChainEqualChainOfPool = chain?.id && chain.id === chainOfPool

  const formattedClaimTime = moment(poolInfo.claimAt * 1000).format('MMM D, YYYY hh:mm A')

  const formatedSwappedAmount0 = poolWithParticipantInfo?.participant.swappedAmount0
    ? formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
        unit: poolInfo.token0.decimals,
        decimalPlaces: 2
      })
    : '0'

  const [action, setAction] = useState<ActionState>(isJoined ? 'Bid_Or_Regret' : 'To_Confirm_Notice')
  const [bidAmount, setBidAmount] = useState<string>('')

  useEffect(() => {
    setAction(isJoined ? 'Bid_Or_Regret' : 'To_Confirm_Notice')
  }, [isConnected, account, isJoined])

  useEffect(() => {
    if (chain && chain.unsupported) {
      setAction('To_Confirm_Notice')
    }
  }, [chain])

  useEffect(() => {
    if (action !== 'Confirm_Notice' && action !== 'Bid') {
      setBidAmount('')
    }
  }, [action])

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: poolInfo.claimAt * 1000,
    onEnd: getPoolInfo
  })

  console.log('>>>>> action: ', action)

  return (
    <Box sx={{ flex: 1, pt: 28 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">Join The Pool</Typography>
        <PoolStatusBox
          status={poolInfo.status}
          openTime={poolInfo.openAt}
          closeTime={poolInfo.closeAt}
          onEnd={getPoolInfo}
        />
      </Box>

      <Stack spacing={10} sx={{ mt: 16 }}>
        <PoolInfoItem title="Bid swap ratio">
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography>1</Typography>

            <TokenImage
              alt={poolInfo.token0.symbol}
              src={
                poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon.src
              }
              size={20}
            />

            <Typography>
              {poolInfo.token0.symbol} = {poolInfo.ratio}
            </Typography>

            <TokenImage alt={poolInfo.token1.symbol} src={poolInfo.token1.largeUrl} size={20} />

            <Typography>{poolInfo.token1.symbol}</Typography>
          </Stack>
        </PoolInfoItem>

        <PoolInfoItem title="Successful bid amount" tip="The amount of token you successfully secured.">
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography>{formatedSwappedAmount0}</Typography>
            <TokenImage
              alt={poolInfo.token0.symbol}
              src={
                poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon.src
              }
              size={20}
            />
            <Typography>{poolInfo.token0.symbol}</Typography>
          </Stack>
        </PoolInfoItem>

        {isClaimmingDelayed && <PoolInfoItem title="Delay Unlocking Token Date">{formattedClaimTime}</PoolInfoItem>}

        {(isJoined || action === 'Bid_Or_Regret') && countdown > 0 ? (
          <>
            <Divider sx={{ mt: 10 }} />
            <PoolInfoItem title="Claim token" sx={{ mt: 10 }}>
              <Typography>
                in {days}d : {hours}h : {minutes}m : {seconds}s
              </Typography>
            </PoolInfoItem>
          </>
        ) : null}
      </Stack>

      {isConnected ? (
        poolInfo.status === PoolStatus.Upcoming || poolInfo.status === PoolStatus.Live ? (
          <>
            {action === 'Confirm_Notice' && (
              <ParticipationConfirmation
                onConfirm={() => {
                  setAction('Bid')
                }}
              />
            )}

            {(action === 'Bid' || action === 'To_Confirm_Notice') && (
              <BidBlock setAction={setAction} action={action} setBidAmount={setBidAmount} bidAmount={bidAmount} />
            )}

            {action === 'Bid_Or_Regret' && <BidOrRegretBlock setAction={setAction} />}

            {(action === 'Input_Refund_Amount' || action === 'Confirm_Refund') && (
              <RefundBlock setAction={setAction} action={action} />
            )}
          </>
        ) : (
          <>
            {isJoined ? (
              !isCurrentChainEqualChainOfPool ? (
                <SwitchNetworkButton targetChain={chainConfig.ethChainId} />
              ) : !poolWithParticipantInfo?.participant.claimed ? (
                <ClaimButton />
              ) : (
                <SuccessfullyClaimedAlert sx={{ mt: 32 }} />
              )
            ) : (
              <></>
            )}
          </>
        )
      ) : (
        <ConnectWalletButton />
      )}
    </Box>
  )
}

export default UserActionBox
