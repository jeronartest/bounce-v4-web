import React from 'react'
import { Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { ContentCopy } from '@mui/icons-material'

interface Props {
  toCopy: string
  children?: React.ReactNode
  width?: number
}

export default function Copy(props: Props) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children, width } = props

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        width: width || 16,
        '& svg': {
          width: width || 16,
          mr: '10px'
        }
      }}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied ? <CheckIcon sx={{ opacity: 0.6, fontSize: 16 }} /> : <ContentCopy />}
      {children}
    </Box>
  )
}
