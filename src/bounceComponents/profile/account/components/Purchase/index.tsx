import { Box } from '@mui/material'
import React from 'react'
import SettingsBox from '../../SettingsBox'

// export type IindexProps = {}

const index: React.FC = ({}) => {
  return (
    <SettingsBox title="Purchase">
      <Box sx={{ mt: 20, mb: 48, borderRadius: 20, background: 'var(--ps-gray-50)', height: 60 }}></Box>
    </SettingsBox>
  )
}

export default index
