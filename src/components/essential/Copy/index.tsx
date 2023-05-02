import React from 'react'
import { Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { ReactComponent as CopySvg } from 'assets/svg/account/copy-icon.svg'

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
        width: width || 20,
        '& svg': {
          width: width || 20
        }
      }}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied ? <CheckIcon sx={{ opacity: 0.6, fontSize: 16 }} /> : <CopySvg />}
      {children}
    </Box>
  )
}
