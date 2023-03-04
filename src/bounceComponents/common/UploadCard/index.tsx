import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import UploadItem from './UploadItem'
import type { IFile } from 'bounceComponents/common/Uploader'
export type IUploadCardProps = {
  accept?: string[]
  maxNum?: number
  limitSize?: number
  value?: IFile[]
  onChange?: (value: IFile[]) => void
}

const UploadList: React.FC<IUploadCardProps> = ({ value, accept, maxNum = Infinity, limitSize, onChange }) => {
  const [files, setFiles] = useState<IFile[]>([])

  const handleChange = (file: IFile, index: number) => {
    if (maxNum > 1) {
      files[index] = file
      setFiles([...files])
    } else {
      setFiles([file])
    }
  }

  const handleRemove = (index: number) => {
    const _files = [...files]
    _files.splice(index, 1)
    setFiles(_files)
  }

  useEffect(() => {
    onChange?.(files)
  }, [files])

  return (
    <Stack direction="row" spacing={16}>
      {files?.map((file, index) => (
        <UploadItem
          key={file.fileUrl}
          value={file}
          onChange={file => {
            handleChange(file, index)
          }}
          onRemove={() => {
            handleRemove(index)
          }}
        />
      ))}
      {files.length < maxNum && (
        <UploadItem
          limitSize={limitSize}
          accept={accept || []}
          onChange={file => {
            handleChange(file, files.length)
          }}
        />
      )}
    </Stack>
  )
}

export default UploadList
