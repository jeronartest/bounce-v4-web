import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export type ISelectCardProps = {
  icon: React.ReactNode
  title: React.ReactNode
  path: string
  description: string
  blackButton?: boolean
  buttonText: string
}

const SelectCard: React.FC<ISelectCardProps> = ({ icon, title, path, description, buttonText, blackButton }) => {
  const navigate = useNavigate()
  return (
    <Stack
      justifyContent="space-between"
      sx={{
        flex: '1',
        borderRadius: '20px',
        border: '1px solid #E5EAF0;',
        p: '36px 28px 40px 28px',
        textAlign: 'center',
        height: 300,
        boxSizing: 'content-box'
      }}
      bgcolor={blackButton ? 'var(--ps-gray-50)' : ''}
    >
      <Box>
        <Box sx={{ lineHeight: 1 }}>{icon}</Box>
        <Stack justifyContent="center" spacing={8} sx={{ pb: 40, mt: 24 }}>
          <Typography variant="h3" color={'var(--ps-gray-900)'}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: '0.8' }} color={'var(--ps-gray-900)'}>
            {description}
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ alignSelf: 'center' }}>
        <Button
          sx={{ width: 160 }}
          variant={blackButton ? 'contained' : 'outlined'}
          disabled={buttonText === 'Apply to Invest'}
          onClick={() => navigate(path)}
        >
          {buttonText}
        </Button>
      </Box>
    </Stack>
  )
}

export default SelectCard
