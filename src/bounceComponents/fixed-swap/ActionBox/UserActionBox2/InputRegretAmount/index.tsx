import { Box } from '@mui/material'

import RegretBalance from './RegretBalance'
import RegretAmountInput from './RegretAmountInput'
import Token1ToRegret from './Token1ToRegret'
import ButtonBlock from './ButtonBlock'
import { FixedSwapPoolProp } from 'api/pool/type'

export interface InputRegretAmountProps {
  regretAmount: string
  slicedRegretAmount: string
  setRegretAmount: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
  poolInfo: FixedSwapPoolProp
}

const InputRegretAmount = ({
  regretAmount,
  poolInfo,
  slicedRegretAmount,
  setRegretAmount,
  onCancel,
  onConfirm
}: InputRegretAmountProps) => {
  return (
    <Box>
      <RegretBalance poolInfo={poolInfo} />

      <RegretAmountInput poolInfo={poolInfo} regretAmount={regretAmount} setRegretAmount={setRegretAmount} />

      <Token1ToRegret poolInfo={poolInfo} regretAmount={slicedRegretAmount} />

      <ButtonBlock poolInfo={poolInfo} regretAmount={slicedRegretAmount} onCancel={onCancel} onConfirm={onConfirm} />
    </Box>
  )
}

export default InputRegretAmount
