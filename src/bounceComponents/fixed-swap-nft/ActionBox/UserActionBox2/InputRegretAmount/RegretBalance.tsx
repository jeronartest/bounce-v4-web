import React from 'react'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { BigNumber } from 'bignumber.js'

import { commify, parseUnits } from 'ethers/lib/utils.js'
import Image from 'next/image'
import TokenImage from 'bounceComponents/common/TokenImage'
import { formatNumber } from '@/utils/web3/number'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import NumberInput from 'bounceComponents/common/NumberInput'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'

import ErrorSVG from 'assets/imgs/icon/error_outline.svg'

const RegretBalance = () => {
  const { data: poolInfo, loading: isPoolInfoLoading } = usePoolInfo()
  const { data: poolWithParticipantInfo, loading: isPoolWithParticipantInfoLoading } = usePoolWithParticipantInfo()

  const formattedRegretBalance =
    !isPoolInfoLoading && !isPoolWithParticipantInfoLoading
      ? poolWithParticipantInfo?.participant.swappedAmount0
        ? formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
            unit: poolInfo.token0.decimals
          })
        : '0'
      : '-'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5">Regret Amount</Typography>
      <Tooltip title="You can regret your participation and get the amount of fund back.">
        <HelpOutlineIcon sx={{ width: 20, height: 20, ml: 4 }} />
      </Tooltip>
      <Typography sx={{ ml: 'auto' }}>
        Regret Balance: {formattedRegretBalance} {poolInfo.token0.symbol}
      </Typography>
    </Box>
  )
}

export default RegretBalance
