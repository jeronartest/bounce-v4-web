import React, { useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

interface CheckProps {
  onConfirm: () => void
}

const Check = ({ onConfirm }: CheckProps) => {
  const [confirmationState, setConfirmationState] = useState({
    notice1: false,
    notice2: false,
    notice3: false
  })

  const handleChange = (event: React.ChangeEvent<any>) => {
    setConfirmationState({
      ...confirmationState,
      [event.target.name]: event.target.checked
    })
  }

  const { notice1, notice2, notice3 } = confirmationState

  return (
    <Box sx={{ mt: 32 }}>
      <Typography variant="h5">Please check the following information before your participation</Typography>

      <FormGroup>
        <FormControlLabel
          checked={notice1}
          name="notice1"
          control={<Checkbox defaultChecked />}
          onChange={handleChange}
          label="I researched the creator"
        />
        <FormControlLabel
          checked={notice2}
          control={<Checkbox />}
          onChange={handleChange}
          name="notice2"
          label="I checked the token and contract address to make sure it is not fake token"
        />
        <FormControlLabel
          checked={notice3}
          control={<Checkbox />}
          onChange={handleChange}
          name="notice3"
          label="I checked the price"
        />
      </FormGroup>

      <Button
        variant="contained"
        fullWidth
        disabled={!Object.values(confirmationState).every(item => item === true)}
        sx={{ mt: 24 }}
        onClick={onConfirm}
      >
        Confirm and continue
      </Button>
    </Box>
  )
}

export default Check
