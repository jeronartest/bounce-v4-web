import { useCallback } from 'react'
import { Button, Typography } from '@mui/material'
import TokenImage from 'bounceComponents/common/TokenImage'
import { formatNumber } from 'utils/number'
import NumberInput from 'bounceComponents/common/NumberInput'
import { FixedSwapPoolProp } from 'api/pool/type'

interface RegretAmountInputProps {
  regretAmount: string
  setRegretAmount: (value: string) => void
  poolInfo: FixedSwapPoolProp
}

const RegretAmountInput = ({ regretAmount, setRegretAmount, poolInfo }: RegretAmountInputProps) => {
  const handleMaxButtonClick = useCallback(() => {
    if (!poolInfo?.participant.swappedAmount0 || poolInfo.participant.swappedAmount0 === '0') {
      return
    }
    setRegretAmount(
      formatNumber(poolInfo?.participant.swappedAmount0, {
        unit: poolInfo.token0.decimals,
        decimalPlaces: poolInfo.token0.decimals,
        shouldSplitByComma: false
      })
    )
  }, [poolInfo.participant.swappedAmount0, poolInfo.token0.decimals, setRegretAmount])

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

          <TokenImage alt={poolInfo.token0.symbol} src={poolInfo.token0.largeUrl} size={24} />
          <Typography sx={{ ml: 8 }}>{poolInfo.token0.symbol}</Typography>
        </>
      }
    />
  )
}

export default RegretAmountInput
