import { Avatar, Box, ListItemButton, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import ProjectCardSvg from '../common/ProjectCardSvg'

export type IProjectCardProps = {
  icon: string
  title: string
  desc: string
}

const ProjectCard: React.FC<Partial<IProjectCardProps>> = ({ icon, title, desc }) => {
  return (
    <Paper
      sx={{ borderRadius: 20, p: 16, border: '1px solid rgba(0, 0, 0, 0.1)', height: 322 }}
      elevation={0}
      component={ListItemButton}
    >
      <Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Avatar sx={{ width: 60, height: 60 }} src={icon} />
          <Stack direction={'row'} spacing={4}>
            <Box
              sx={{
                width: 55,
                height: 24,
                borderRadius: 20,
                background: '#D4F5DE',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Typography variant="body2" color={'#259C4A'} margin={'0 auto'}>
                Active
              </Typography>
            </Box>
            <ProjectCardSvg status={1} />
          </Stack>
        </Box>
        <Typography variant="h4" sx={{ mt: 16 }}>
          {title}
        </Typography>
        <Stack direction={'row'} spacing={4} mt={10}>
          <Box sx={{ borderRadius: 20, p: '4px 8px', background: 'var(--ps-gray-50)' }}>
            <Typography variant="body2">Seed</Typography>
          </Box>
          <Box sx={{ borderRadius: 20, p: '4px 8px', background: 'var(--ps-gray-50)' }}>
            <Typography variant="body2">Founded in Jul 2021</Typography>
          </Box>
        </Stack>
        <Typography
          variant="body2"
          textOverflow={'ellipsis'}
          overflow="hidden"
          display="-webkit-box"
          height={100}
          sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 5, mt: 16, opacity: 0.8, lineHeight: '20px' }}
        >
          {desc}
        </Typography>
      </Box>
    </Paper>
  )
}

export default ProjectCard
