import React from 'react'
import { Box, Button } from '@mui/material'
import { ExternalLink } from 'themes/components'
import LogoText from 'components/LogoText'

// const GreenCircle = styled('div')(({ theme }) => ({
//   display: 'flex',
//   flexFlow: 'row nowrap',
//   justifyContent: 'center',
//   alignItems: 'center',
//   '& div ': {
//     height: 8,
//     width: 8,
//     marginRight: 8,
//     backgroundColor: theme.palette.success.main,
//     borderRadius: '50%'
//   }
// }))

export default function Option({
  link = null,
  clickable = true,
  onClick = null,
  header,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  onClick?: (() => void) | null
  header: React.ReactNode
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <>
      <Button
        variant="outlined"
        key={id}
        fullWidth
        sx={{
          borderColor: active ? 'var(--ps-yellow-1)' : 'var(--ps-border-1)'
        }}
        onClick={!active ? onClick || undefined : undefined}
        disabled={!clickable}
      >
        <Box width={140}>
          <LogoText fontSize={14} logo={icon} text={header} />
        </Box>
      </Button>
    </>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }
  return content
}
