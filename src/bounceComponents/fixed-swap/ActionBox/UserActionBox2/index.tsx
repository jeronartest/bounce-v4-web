import { Box } from '@mui/material'

import Header from './Header'
import InfoList from './InfoList'
import ActionBlock from './ActionBlock'

const UserActionBox2 = () => {
  return (
    <Box sx={{ flex: 1, pt: 28 }}>
      <Header />

      <InfoList />

      <ActionBlock />
    </Box>
  )
}

export default UserActionBox2
