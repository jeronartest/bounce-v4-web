import React from 'react'
import { Box, ButtonBase, Stack, Typography } from '@mui/material'

import { ActionType } from '../ValuesProvider'
import { CompletedSteps } from '../types'

interface AuctionStepProps {
  label: string
  completed?: boolean
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

const AuctionStep = ({ label, completed, active, disabled, onClick }: AuctionStepProps): JSX.Element => {
  return (
    <ButtonBase sx={{ flex: 1, p: 10 }} disabled={disabled} onClick={onClick}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h4" sx={{ fontSize: 12, color: completed || active ? '#171717' : '#B3B7C8' }}>
          {label}
        </Typography>
        <Box
          sx={{
            bgcolor: completed ? '#171717' : active ? '#2663FF' : '#D8DBE7',
            borderRadius: 2,
            height: 4,
            width: '100%',
            mt: 10
          }}
        />
      </Box>
    </ButtonBase>
  )
}

export interface IAuctionCreationStepperProps {
  steps: string[]
  valuesState: any
  valuesDispatch: (value: any) => void
}

const AuctionCreationStepper: React.FC<IAuctionCreationStepperProps> = ({ steps, valuesState, valuesDispatch }) => {
  const getIsStepButtonEnable = (targetStepIndex: number, completedSteps: CompletedSteps): boolean => {
    return Object.keys(completedSteps).includes(String(targetStepIndex)) && completedSteps[targetStepIndex] === true
  }

  return (
    <Stack direction="row" spacing={8} justifyContent="space-between">
      {steps.map((label, index) => (
        <AuctionStep
          key={`${label}_${index}`}
          label={label}
          active={valuesState?.activeStep === index}
          disabled={index >= valuesState?.activeStep}
          completed={valuesState?.completed[index]}
          onClick={() => {
            // only allow going to completed steps
            if (getIsStepButtonEnable(index, valuesState?.completed)) {
              valuesDispatch?.({
                type: ActionType.HandleStep,
                payload: {
                  activeStep: index
                }
              })
            }
          }}
        />
      ))}
    </Stack>
  )
}

export default AuctionCreationStepper
