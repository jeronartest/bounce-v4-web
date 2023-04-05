import React from 'react'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { BigNumber } from 'bignumber.js'

import { commify, parseUnits } from 'ethers/lib/utils.js'
import Image from 'next/image'
import DefaultNftIcon from '@/components/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'
import TokenImage from '@/components/common/TokenImage'
import { formatNumber } from '@/utils/web3/number'
import PoolInfoItem from '@/components/fixed-swap/PoolInfoItem'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import NumberInput from '@/components/common/NumberInput'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'

import ErrorSVG from 'assets/imgs/icon/error_outline.svg'

export interface InputRefundAmountProps {
  refundAmount: string
  setRefundAmount: React.Dispatch<React.SetStateAction<string>>
  onCancel: () => void
  onConfirm: () => void
}

const InputRefundAmount = ({
  refundAmount,
  setRefundAmount,
  onCancel,
  onConfirm
}: InputRefundAmountProps): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const formattedRegretBalance = poolWithParticipantInfo?.participant.swappedAmount0
    ? formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
        unit: poolInfo.token0.decimals
      })
    : '-'
  const formattedRegretBidAmount = refundAmount ? new BigNumber(refundAmount).times(poolInfo.ratio).toString() : '-'

  const handleMaxButtonClick = () => {
    if (
      !poolWithParticipantInfo?.participant.swappedAmount0 ||
      poolWithParticipantInfo.participant.swappedAmount0 === '0'
    ) {
      return
    }
    setRefundAmount(
      commify(
        formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
          unit: poolInfo.token0.decimals,
          decimalPlaces: poolInfo.token0.decimals,
          shouldSplitByComma: false
        })
      )
    )
  }

  const isRegretBalanceSufficient = new BigNumber(
    refundAmount ? parseUnits(refundAmount, poolInfo.token0.decimals).toString() : '0'
  ).lte(poolWithParticipantInfo?.participant.swappedAmount0)

  return (
    <Box sx={{ mt: 32 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5">Regret Amount</Typography>
        <Tooltip title="You can regret your participation and get the amount of fund back.">
          <HelpOutlineIcon sx={{ width: 20, height: 20, ml: 4 }} />
        </Tooltip>
        <Typography sx={{ ml: 'auto' }}>
          Regret Balance: {formattedRegretBalance} {poolInfo.token0.symbol}
        </Typography>
      </Box>

      <NumberInput
        sx={{ mt: 12 }}
        fullWidth
        placeholder="Enter"
        value={refundAmount}
        onUserInput={value => {
          setRefundAmount(value)
        }}
        endAdornment={
          <>
            <Button size="small" variant="outlined" sx={{ mr: 20, minWidth: 60 }} onClick={handleMaxButtonClick}>
              Max
            </Button>

            <TokenImage
              alt={poolInfo.token0.symbol}
              src={
                poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon.src
              }
              size={24}
            />
            <Typography sx={{ ml: 8 }}>{poolInfo.token0.symbol}</Typography>
          </>
        }
      />

      <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
        <Typography>
          {formattedRegretBidAmount} {poolInfo.token1.symbol}
        </Typography>
      </PoolInfoItem>

      <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        {isRegretBalanceSufficient ? (
          <Button variant="contained" fullWidth disabled={!refundAmount} onClick={onConfirm}>
            Confirm
          </Button>
        ) : (
          <Button variant="contained" fullWidth disabled>
            Insufficient balance
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default InputRefundAmount
