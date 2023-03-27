import { Dots } from 'themes/components'
import { Box, Container, SxProps, Theme, Typography } from '@mui/material'
import { ReactComponent as DefaultIcon } from 'assets/svg/default.svg'

export default function ComingSoon({ sx }: { sx?: SxProps<Theme> | undefined }) {
  return (
    <Box
      sx={{
        padding: '40px 60px',
        ...sx
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '20px',
          minHeight: 436,
          display: 'grid',
          justifyItems: 'center',
          alignItems: 'center'
        }}
      >
        <Box>
          <DefaultIcon />
          <Typography
            fontWeight={500}
            sx={{
              color: '#908E96',
              fontSize: 28,
              mt: 40
            }}
          >
            Coming soon <Dots />
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
