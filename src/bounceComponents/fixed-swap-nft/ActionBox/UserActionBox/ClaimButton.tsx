import React from 'react'
import { useCountDown, useRequest } from 'ahooks'
import { useAccount } from 'wagmi'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'
import { Box, Button, Typography } from '@mui/material'
import { hide, show } from '@ebay/nice-modal-react'

import { commify } from 'ethers/lib/utils.js'
import { userClaimCall } from '@/utils/web3/contractCalls/fixedSwap'
import { useFixedSwapContract } from 'bounceHooks/web3/useContractHooks/useContract'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import { PoolStatus } from '@/api/pool/type'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'
import { formatNumber } from '@/utils/web3/number'
import usePoolWithParticipantInfo from 'bounceHooks/auction/use1155PoolWithParticipantInfo'

const ClaimButton = () => {
  const { isConnected } = useAccount()

  const fixedSwapContract = useFixedSwapContract()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const isJoined =
    poolWithParticipantInfo?.participant &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '' &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '0'

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: poolInfo.claimAt * 1000,
    onEnd: getPoolInfo
  })

  const { run: userClaim, loading: isUserClaimming } = useRequest(
    async () => {
      const tx = await userClaimCall(fixedSwapContract, poolInfo?.poolId)

      show(DialogConfirmation, {
        title: 'Bounce waiting for transaction settlement',
        subTitle:
          'Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.'
      })

      return tx.wait(1)
    },
    {
      manual: true,
      ready: !!fixedSwapContract && isConnected && !!poolInfo?.poolId && isJoined,
      onBefore: () => {
        show(DialogConfirmation, {
          title: 'Bounce requests wallet interaction',
          subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.'
        })
      },
      onSuccess: () => {
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully claimed ${commify(
            formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
              unit: poolInfo.token0.decimals,
              decimalPlaces: 4,
              shouldSplitByComma: false
            })
          )} ${poolInfo.token0.symbol}`
        })
      },
      onError: error => {
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: userClaim
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      }
    }
  )

  if (poolInfo.status === PoolStatus.Closed && moment().unix() <= poolInfo.claimAt) {
    return (
      <Button variant="contained" fullWidth sx={{ mt: 32, px: 36 }} disabled>
        <Box
          sx={{
            display: 'flex',
            justifyContent: countdown > 0 ? 'space-between' : 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="span">Claim Token</Typography>
          {countdown > 0 && (
            <Typography component="span">
              {days}d : {hours}h : {minutes}m : {seconds}s
            </Typography>
          )}
        </Box>
      </Button>
    )
  }

  return (
    <LoadingButton variant="contained" fullWidth sx={{ mt: 32 }} onClick={userClaim} loading={isUserClaimming}>
      Claim Token
    </LoadingButton>
  )
}

export default ClaimButton
