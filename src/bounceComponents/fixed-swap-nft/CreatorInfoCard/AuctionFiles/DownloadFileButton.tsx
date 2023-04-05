import React from 'react'
import { ButtonBase } from '@mui/material'

import MaskIcon from './MaskIcon'
import FileIcon from './FileIcon'
import { ReactComponent as DownloadSVG } from 'assets/imgs/icon/download.svg'
import { shouldFileTypeShowIcon } from '@/utils/file'

export interface DownloadFileButtonProps {
  fileType?: string
  thumbnailUrl?: string
  fileUrl?: string
}

const DownloadFileButton = ({ fileType, thumbnailUrl, fileUrl }: DownloadFileButtonProps) => {
  return (
    <a href={fileUrl}>
      <ButtonBase
        sx={{
          width: 52,
          height: 52,
          borderRadius: 10,
          position: 'relative',
          '&:hover div': {
            display: 'flex'
          },
          border: shouldFileTypeShowIcon(fileType) ? '1px solid #D7D6D9' : undefined
        }}
      >
        <FileIcon fileType={fileType} thumbnailUrl={thumbnailUrl} fileUrl={fileUrl} />

        <MaskIcon>
          <DownloadSVG />
        </MaskIcon>
      </ButtonBase>
    </a>
  )
}

export default DownloadFileButton
