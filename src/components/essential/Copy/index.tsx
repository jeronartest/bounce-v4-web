import React from 'react'
import { Box, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { ReactComponent as CopySvg } from 'assets/svg/account/copy-icon.svg'
import Tooltip from 'bounceComponents/common/Tooltip'

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
          ':hover path': {
            fill: 'var(--ps-text-7)'
          },
          width: width || 20
        }
      }}
      onClick={() => setCopied(toCopy)}
    >
      <Tooltip
        title={
          <Typography
            sx={{
              fontSize: 12,
              textDecoration: 'underline'
            }}
          >
            {isCopied ? 'Copied' : 'Click to copy'}
          </Typography>
        }
      >
        {isCopied ? <CheckIcon sx={{ color: 'var(--ps-text-7)', fontSize: 18 }} /> : <CopySvg />}
      </Tooltip>
      {children}
    </Box>
  )
}
