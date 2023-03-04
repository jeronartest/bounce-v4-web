import { IconButton, Stack, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import { ReactComponent as ChevronLeftSVG } from '@/assets/imgs/profile/chevron-left.svg'

export type IGoBackProps = {
  title: string | ReactNode
  goBack: () => void
}

const GoBack: React.FC<IGoBackProps> = ({ title, goBack }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton sx={{ background: 'var(--ps-primary)', width: 46, height: 46 }} onClick={goBack}>
        <ChevronLeftSVG />
      </IconButton>
      <Typography variant="h2" sx={{ ml: 12 }}>
        {title}
      </Typography>
    </Stack>
  )
}

export default GoBack
