import React from 'react'
import { Box } from '@mui/material'

import LeftBox from '../../LeftBox'
import UserActionBox2 from '../../ActionBox/UserActionBox2'
import Alert from './Alert'

const UserMainBlock = (): JSX.Element => {
  return (
    <Box
      sx={{ borderRadius: 20, px: 24, py: 20, bgcolor: '#fff', display: 'flex', flexDirection: 'column', rowGap: 12 }}
    >
      <Alert />

      <Box sx={{ display: 'flex', columnGap: 12 }}>
        <LeftBox />
        {/* <UserActionBox /> */}
        <UserActionBox2 />
      </Box>
    </Box>
  )
}

export default UserMainBlock
