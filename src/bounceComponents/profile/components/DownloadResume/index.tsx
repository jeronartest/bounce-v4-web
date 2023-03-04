import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import ResumeUploadItem from '../../ResumeFiles/ResumeUploadItem'
import { RootState } from '@/store'

export interface IDownloadResume {
  resumes: any[]
}

const DownloadResume: React.FC<IDownloadResume> = ({ resumes }) => {
  if (resumes?.length === 0) {
    return <></>
  }

  return (
    <Box>
      <Divider variant="middle" sx={{ borderColor: 'var(--ps-gray-300)' }} />
      <Box sx={{ padding: '48px' }}>
        <Typography variant="h2" fontSize={24}>
          Downloads
        </Typography>
        <Stack direction={'row'} spacing={19} sx={{ mt: 30 }}>
          {resumes?.map((file) => {
            return <ResumeUploadItem key={file.fileUrl} value={file} />
          })}
        </Stack>
      </Box>
    </Box>
  )
}

export default DownloadResume
