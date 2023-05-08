import { Dots } from 'themes/components'
import { Box, Container, SxProps, Theme, Typography } from '@mui/material'
import DefaultIcon from 'assets/imgs/common/ComingSoon.png'

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
          minHeight: 436,
          display: 'grid',
          justifyItems: 'center',
          alignItems: 'center'
        }}
      >
        <Box mt={100}>
          <img
            style={{
              width: 453,
              margin: '0 auto'
            }}
            src={DefaultIcon}
            alt=""
            srcSet=""
          />
          <Typography
            fontWeight={500}
            sx={{
              color: '#908E96',
              fontSize: 28,
              textAlign: 'center',
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
