import { LoadingButton } from '@mui/lab'
import { Container, Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export type IViewMoreListBoxProps = {
  title: string
  children?: React.ReactNode
  loading?: boolean
  handleClick?: () => void
  show: boolean
  showDivider?: boolean
}

const ViewMoreListBox: React.FC<IViewMoreListBoxProps> = ({
  title,
  children,
  loading,
  handleClick,
  show,
  showDivider = true
}) => {
  return (
    <Container sx={{ px: 0 }}>
      <Box>
        {showDivider ? <Divider variant="middle" sx={{ borderColor: 'var(--ps-gray-300)' }} /> : <></>}
        <Box p={48}>
          <Typography variant="h2" fontSize={24}>
            {title}
          </Typography>
          <Box pt={30}>{children}</Box>
          {show ? (
            <LoadingButton
              variant="outlined"
              loading={loading}
              sx={{ width: 124, display: 'flex', mx: 'auto', height: 40, marginTop: 48 }}
              onClick={handleClick}
            >
              View more
            </LoadingButton>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default ViewMoreListBox
