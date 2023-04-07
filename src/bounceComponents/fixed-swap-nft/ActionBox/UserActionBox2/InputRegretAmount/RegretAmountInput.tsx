import React, { useCallback } from 'react'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { BigNumber } from 'bignumber.js'

import { commify, parseUnits } from 'ethers/lib/utils.js'
import Image from 'next/image'
import RegretBalance from './RegretBalance'
import TokenImage from 'bounceComponents/common/TokenImage'
import { formatNumber } from '@/utils/web3/number'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import NumberInput from 'bounceComponents/common/NumberInput'
import usePoolWithParticipantInfo from 'bounceHooks/auction/use1155PoolWithParticipantInfo'
import DefaultNftIcon from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'

interface RegretAmountInputProps {
  regretAmount: string
  setRegretAmount: (value: string) => void
}

const RegretAmountInput = ({ regretAmount, setRegretAmount }: RegretAmountInputProps) => {
  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const handleMaxButtonClick = useCallback(() => {
    if (
      !poolWithParticipantInfo?.participant.swappedAmount0 ||
      poolWithParticipantInfo.participant.swappedAmount0 === '0'
    ) {
      return
    }
    setRegretAmount(
      formatNumber(poolWithParticipantInfo?.participant.swappedAmount0, {
        unit: poolInfo.token0.decimals,
        decimalPlaces: poolInfo.token0.decimals,
        shouldSplitByComma: false
      })
    )
  }, [poolInfo.token0.decimals, poolWithParticipantInfo.participant.swappedAmount0, setRegretAmount])

  return (
    <NumberInput
      sx={{ mt: 12 }}
      fullWidth
      placeholder="Enter"
      value={regretAmount}
      onUserInput={value => {
        setRegretAmount(value)
      }}
      endAdornment={
        <>
          <Button size="small" variant="outlined" sx={{ mr: 20, minWidth: 60 }} onClick={handleMaxButtonClick}>
            Max
          </Button>

          <TokenImage
            alt={poolInfo.token0.symbol}
            src={poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon.src}
            size={24}
          />
          <Typography sx={{ ml: 8 }}>{poolInfo.token0.symbol}</Typography>
        </>
      }
    />
  )
}

export default RegretAmountInput
