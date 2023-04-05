import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useCountDown } from 'ahooks'
import React from 'react'
import PoolInfoItem from '../../PoolInfoItem'
import { ActionState } from '.'

export interface BidOrRegretBlockProps {
  setAction: React.Dispatch<React.SetStateAction<ActionState>>
}

const BidOrRegretBlock = ({ setAction }: BidOrRegretBlockProps): JSX.Element => {
  return (
    <Box>
      <Stack spacing={16}>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 32 }}
          onClick={() => {
            setAction('To_Confirm_Notice')
          }}
        >
          Place a Bid
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setAction('Input_Refund_Amount')
          }}
        >
          Regret and Get fund back
        </Button>
      </Stack>
    </Box>
  )
}

export default BidOrRegretBlock
