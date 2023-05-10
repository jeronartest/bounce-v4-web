import { Box, Container, SxProps, Theme, Typography } from '@mui/material'
import DefaultIcon from 'assets/imgs/common/ComingSoon.png'

export default function ProfileEmpty({
  sx,
  prompt,
  username
}: {
  sx?: SxProps<Theme> | undefined
  prompt?: string
  username?: string
}) {
  return (
    <Box
      sx={{
        padding: '0 60px 40px',
        width: '100%',
        ...sx
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
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
            variant="h4"
            sx={{
              fontSize: 20,
              textAlign: 'center',
              mt: 40
            }}
          >
            @{username} hasn’t created Auction
          </Typography>
          {prompt && <Typography textAlign={'center'}>{prompt}</Typography>}
        </Box>
      </Container>
    </Box>
  )
}
