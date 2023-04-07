import { Stack } from '@mui/material'

import FileItem from './FileItem'
import { PoolInfoProp } from 'bounceComponents/fixed-swap/type'

export interface FileItemListProps {
  canDeleteFile?: boolean
  canDownloadFile?: boolean
  poolInfo: PoolInfoProp
  getPoolInfo: () => void
}

const FileItemList = ({ poolInfo, getPoolInfo, canDeleteFile, canDownloadFile }: FileItemListProps) => {
  return (
    <Stack spacing={20}>
      {poolInfo?.posts?.slice(0, 3).map(file => {
        return (
          <FileItem
            poolInfo={poolInfo}
            getPoolInfo={getPoolInfo}
            key={file.id}
            canDeleteFile={canDeleteFile}
            canDownloadFile={canDownloadFile}
            fileId={file.id}
            fileType={file.fileType}
            thumbnailUrl={file.fileThumbnailUrl}
            fileUrl={file.fileUrl}
            fileName={file.fileName}
            fileSize={file.fileSize}
          />
        )
      })}
    </Stack>
  )
}

export default FileItemList
