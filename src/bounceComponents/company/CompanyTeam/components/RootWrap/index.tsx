import { Stack, Typography } from '@mui/material'
import React from 'react'

export type IRootWrapProps = {
  component: React.ReactNode
  title: string
  required?: boolean
}

const RootWrap: React.FC<IRootWrapProps> = ({ component, title, required = false }) => {
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={10} mb={40}>
        <Typography variant="h2">{title}</Typography>
        {!required && <Typography variant="body1" color={'var(--ps-gray-700)'}>{`(Optional)`}</Typography>}
      </Stack>
      {component}
    </div>
  )
}

export default RootWrap
