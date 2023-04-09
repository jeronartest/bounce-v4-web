import { useCallback } from 'react'
import { Button, Typography } from '@mui/material'
import TokenImage from 'bounceComponents/common/TokenImage'
import NumberInput from 'bounceComponents/common/NumberInput'
import DefaultNftIcon from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'

interface RegretAmountInputProps {
  regretAmount: string
  setRegretAmount: (value: string) => void
}

const RegretAmountInput = ({
  regretAmount,
  setRegretAmount,
  poolInfo
}: RegretAmountInputProps & FixedSwapPoolParams) => {
  const handleMaxButtonClick = useCallback(() => {
    if (!poolInfo?.participant.swappedAmount0 || poolInfo.participant.swappedAmount0 === '0') {
      return
    }
    setRegretAmount(poolInfo.participant.swappedAmount0 || '')
  }, [poolInfo.participant.swappedAmount0, setRegretAmount])

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
            src={poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon}
            size={24}
          />
          <Typography sx={{ ml: 8 }}>{poolInfo.token0.symbol}</Typography>
        </>
      }
    />
  )
}

export default RegretAmountInput
