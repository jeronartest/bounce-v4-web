import React from 'react'

import { Button, Stack } from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'

const Rate = () => {
  return (
    <Stack direction="row" spacing={6}>
      <Button size="small" startIcon={<ThumbUpOutlinedIcon />} sx={{ px: 16, bgcolor: '#fff' }}>
        666666
      </Button>
      <Button size="small" startIcon={<ThumbDownOutlinedIcon />} sx={{ px: 16, bgcolor: '#fff' }}>
        999999
      </Button>
    </Stack>
  )
}

export default Rate
