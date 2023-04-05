import React, { useState } from 'react'
import { Button, OutlinedInput, Typography } from '@mui/material'
import NumberInput from '@/components/common/NumberInput'

export interface InputBlockProps {
  action: any
}

const InputBlock = ({}) => {
  return (
    <>
      <OutlinedInput />
      <Button>To check</Button>
    </>
  )
}

export default InputBlock
