import { Box } from '@mui/material'

import RegretBalance from './RegretBalance'
import RegretAmountInput from './RegretAmountInput'
import Token1ToRegret from './Token1ToRegret'
import ButtonBlock from './ButtonBlock'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'

export interface InputRegretAmountProps {
  regretAmount: string
  slicedRegretAmount: string
  setRegretAmount: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
  isRegretting: boolean
}

const InputRegretAmount = ({
  regretAmount,
  slicedRegretAmount,
  setRegretAmount,
  poolInfo,
  onCancel,
  isRegretting,
  onConfirm
}: InputRegretAmountProps & FixedSwapPoolParams) => {
  return (
    <Box>
      <RegretBalance poolInfo={poolInfo} />

      <RegretAmountInput poolInfo={poolInfo} regretAmount={regretAmount} setRegretAmount={setRegretAmount} />

      <Token1ToRegret poolInfo={poolInfo} regretAmount={slicedRegretAmount} />

      <ButtonBlock
        isRegretting={isRegretting}
        poolInfo={poolInfo}
        regretAmount={slicedRegretAmount}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Box>
  )
}

export default InputRegretAmount
