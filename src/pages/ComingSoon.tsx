import { Dots } from 'themes/components'
import { Box, Container, SxProps, Theme, Typography } from '@mui/material'
import { ReactComponent as DefaultIcon } from 'assets/svg/default.svg'
import HeaderTab from 'bounceComponents/auction/HeaderTab'

export default function ComingSoon({ sx }: { sx?: SxProps<Theme> | undefined }) {
  return (
    <Box
      sx={{
        padding: '0 60px 40px',
        ...sx
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '20px',
          display: 'grid',
          justifyItems: 'flex-sart',
          alignItems: 'center'
        }}
      >
        <HeaderTab />
      </Container>

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
        <Box mt={100}>
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
