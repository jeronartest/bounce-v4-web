import { Box, IconButton } from '@mui/material'
import Image from 'components/Image'
import React from 'react'
import QuestionSVG from 'assets/imgs/questions.svg'

export const Questions: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 50, right: 30, zIndex: 999 }}>
      <IconButton href="https://forms.gle/M4mDBUv9iQ7tfaRE9" target="_blank">
        <Image src={QuestionSVG} width={30} height={30} alt="questions" />
      </IconButton>
    </Box>
  )
}
