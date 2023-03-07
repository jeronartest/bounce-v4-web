import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'

// export type IJobsProps = {}

const Jobs: React.FC = ({}) => {
  return (
    <section>
      <Container maxWidth="lg">
        <Box sx={{ mt: 64, width: '100%', height: 775, background: '#FFFFFF', borderRadius: 20 }}>
          <Stack sx={{ alignItems: 'center' }}>
            <picture style={{ width: '295px', height: '239px', marginTop: '174px' }}>
              <img src="/imgs/jobs/jobs.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </picture>
            <Typography variant="h1" sx={{ margin: '70px 0 36px', fontSize: 30, fontWeight: 400 }}>
              Opening Soon
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20, color: 'var(--ps-gray-600)' }}>
              Jobs section is opening soon, please come back later.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20, color: 'var(--ps-gray-600)' }}>
              We are looking forward to seeing you on February 20. New Bounce will be launched.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </section>
  )
}

export default Jobs
