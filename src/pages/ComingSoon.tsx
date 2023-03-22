import { Dots } from 'themes/components'
import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'

// const Frame = styled('div')(`
// width: calc(100% - 40px);
// max-width: 500px;
// margin: 20px;
// height: 280px;
// border: 1px solid rgba(255, 255, 255, 0.2);
// box-sizing: border-box;
// border-radius: 32px;
// display: flex;
// flex-direction: column;
// align-items: center;
// justify-content: center;
// background-color: #ffffff;
// `)

// const Title = styled('p')(`
//   font-weight: 500;
//   font-size: 24px;
//   line-height: 88.69%;
// `)

// export default function ComingSoon() {
//   return (
//     <Frame>
//       <Title>
//         Coming Soon <Dots />
//       </Title>
//       <div>This section is still implemeting.</div>
//       <div>Please come back later</div>
//     </Frame>
//   )
// }

const ComingSoon: React.FC = ({}) => {
  return (
    <section>
      <Container maxWidth="lg">
        <Box sx={{ mt: 64, width: '100%', minHeight: 400, background: '#FFFFFF', borderRadius: 20 }}>
          <Stack sx={{ alignItems: 'center' }}>
            {/* <picture style={{ width: '295px', height: '239px', marginTop: '174px' }}>
              <img src="/imgs/jobs/jobs.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </picture> */}
            <Typography variant="h1" sx={{ margin: '70px 0 36px', fontSize: 30, fontWeight: 400 }}>
              Coming Soon
              <Dots />
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20, color: 'var(--ps-gray-600)' }}>
              This section is still implementing.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20, color: 'var(--ps-gray-600)' }}>
              Please come back later
            </Typography>
          </Stack>
        </Box>
      </Container>
    </section>
  )
}

export default ComingSoon
