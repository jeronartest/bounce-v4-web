import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import ResumeUploadItem from '../ResumeUploadItem'
import type { IFile } from '@/components/common/Uploader'
export type IUploadCardProps = {
  accept?: string[]
  maxNum?: number
  limitSize?: number
  value?: IFile[]
  onChange?: (value: IFile[]) => void
  showRemove?: boolean
  tips?: string
}

const ResumeUpload: React.FC<IUploadCardProps> = ({
  value,
  accept,
  maxNum = Infinity,
  limitSize,
  onChange,
  showRemove,
  tips = '',
}) => {
  const [files, setFiles] = useState<IFile[]>([])

  useEffect(() => {
    setFiles(value)
  }, [value])

  const handleChange = (file: IFile, index: number) => {
    if (maxNum > 1) {
      const tempFiles = [...files]
      tempFiles[index] = file

      setFiles([...tempFiles])
      onChange?.([...tempFiles])
    } else {
      setFiles([file])
      onChange?.([file])
    }
  }

  const handleRemove = (index: number) => {
    const _files = [...files]
    _files.splice(index, 1)
    setFiles(_files)
    onChange?.(_files)
  }

  return (
    <Stack spacing={19}>
      {files?.map((file, index) => (
        <ResumeUploadItem
          key={file.fileUrl}
          value={file}
          onChange={(file) => {
            handleChange(file, index)
          }}
          onRemove={() => {
            handleRemove(index)
          }}
        />
      ))}
      {files.length < maxNum && (
        <ResumeUploadItem
          limitSize={limitSize}
          accept={accept || []}
          tips={tips}
          onChange={(file) => {
            handleChange(file, files.length)
          }}
        />
      )}
    </Stack>
  )
}

export default ResumeUpload
