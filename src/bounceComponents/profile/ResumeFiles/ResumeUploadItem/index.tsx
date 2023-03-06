import React, { useState } from 'react'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { ReactComponent as PdfSVG } from '../assets/pdf.svg'
import { ReactComponent as DeleteSVG } from '../assets/delete.svg'
import { ReactComponent as PPTSVG } from '../assets/ppt.svg'
import { ReactComponent as DefaultFileSVG } from '../assets/default_file.svg'
import styles from 'bounceComponents/common/UploadCard/styles'
import { ReactComponent as AddSVG } from 'bounceComponents/common/UploadCard/assets/add.svg'
import Uploader from 'bounceComponents/common/Uploader'
import type { IFile } from 'bounceComponents/common/Uploader'
import { getfilesize } from 'utils'

export const IMAGE_FILES: string[] = [
  'image/png',
  'image/jpeg',
  'image/jp2', // .jpeg200
  'image/jpm', // .jpeg200
  'image/gif',
  'image/webp'
]

export type IUploadItemProps = {
  value?: Partial<IFile>
  accept?: string[]
  limitSize?: number
  onChange?: (value: IFile) => void
  onRemove?: (value?: Partial<IFile>) => void
  sx?: any
  tips?: string
}

const ResumeUploadItem: React.FC<IUploadItemProps> = ({ value, accept, limitSize, onChange, onRemove, sx, tips }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const getFileIcon = () => {
    if (!value) return null
    if (value.fileType === 'application/pdf') {
      return <PdfSVG />
    }
    if (value.fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return <PPTSVG />
    }
    if (value.fileType && IMAGE_FILES.includes(value.fileType)) {
      return (
        <picture>
          <img
            src={value.fileThumbnailUrl || value.fileUrl}
            width={52}
            height={52}
            style={{ borderRadius: 10, objectFit: 'contain' }}
          />
        </picture>
      )
    }
    return <DefaultFileSVG />
  }
  if (value?.fileUrl) {
    return (
      <Stack direction={'row'}>
        <Box sx={styles.fileBox}>
          <Stack direction={'row'} justifyContent="space-between" spacing={12}>
            <Stack direction={'row'} spacing={12}>
              {getFileIcon()}

              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Sharp Grotesk DB Cyr Medium 22'",
                    maxWidth: 194,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    mb: 12
                  }}
                >
                  {value.fileName}
                </Typography>
                <a
                  target={'_blank'}
                  href={value.fileUrl}
                  style={{ color: 'var(--ps-blue)', cursor: 'pointer' }}
                  rel="noreferrer"
                >
                  Download
                </a>
              </Box>
            </Stack>

            <Typography variant="body1" color="var(--ps-gray-700)">
              {getfilesize(Number(value.fileSize))}
            </Typography>
          </Stack>
        </Box>
        {onRemove && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', ml: 16, cursor: 'pointer' }}
            onClick={() => onRemove(value)}
          >
            <DeleteSVG />
            <Typography variant="body1" sx={{ ml: 4 }}>
              Delete
            </Typography>
          </Box>
        )}
      </Stack>
    )
  }

  const UploadContent = () => {
    if (loading)
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100', height: '100%' }}>
          <CircularProgress color="secondary" size={20} />
        </Box>
      )

    return (
      <Box sx={{ ...styles.addItem, borderRadius: 20 }}>
        <Typography variant="body1" sx={{ mr: 8 }}>
          Add
        </Typography>
        <AddSVG />
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          ...styles.item,
          ...sx,

          '&>div:first-of-type': {
            display: 'block'
          }
        }}
        style={{ width: 355, height: 84 }}
      >
        <Uploader
          sx={styles.uploadBox}
          accept={accept}
          tips={tips}
          limitSize={limitSize}
          disabled={loading}
          onBefore={files => {
            setLoading(true)
            return Promise.resolve(files)
          }}
          onSuccess={file => {
            onChange?.(file)
            setLoading(false)
          }}
          onError={() => {
            setLoading(false)
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" sx={styles.content}>
            {UploadContent()}
          </Stack>
        </Uploader>
      </Box>
    </Box>
  )
}

export default ResumeUploadItem
