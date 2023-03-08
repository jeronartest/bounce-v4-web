import React from 'react'
import { Box } from '@mui/material'

import RegretBalance from './RegretBalance'
import RegretAmountInput from './RegretAmountInput'
import Token1ToRegret from './Token1ToRegret'
import ButtonBlock from './ButtonBlock'

export interface InputRegretAmountProps {
  regretAmount: string
  slicedRegretAmount: string
  setRegretAmount: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}

const InputRegretAmount = ({
  regretAmount,
  slicedRegretAmount,
  setRegretAmount,
  onCancel,
  onConfirm
}: InputRegretAmountProps) => {
  return (
    <Box>
      <RegretBalance />

      <RegretAmountInput regretAmount={regretAmount} setRegretAmount={setRegretAmount} />

      <Token1ToRegret regretAmount={slicedRegretAmount} />

      <ButtonBlock regretAmount={slicedRegretAmount} onCancel={onCancel} onConfirm={onConfirm} />
    </Box>
  )
}

export default InputRegretAmount
