import { Box } from '@mui/material'
import ButtonBlock from './ButtonBlock'
import { FixedSwapPoolProp } from 'api/pool/type'

export interface InputRegretAmountProps {
  onCancel: () => void
  onConfirm: () => void
  poolInfo: FixedSwapPoolProp
  isRegretting: boolean
}

const InputRegretAmount = ({ poolInfo, onCancel, isRegretting, onConfirm }: InputRegretAmountProps) => {
  return (
    <Box>
      <ButtonBlock
        isRegretting={isRegretting}
        poolInfo={poolInfo}
        regretAmount={poolInfo.maxAmount1PerWallet}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Box>
  )
}

export default InputRegretAmount
