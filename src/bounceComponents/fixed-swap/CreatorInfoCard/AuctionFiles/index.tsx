import { Stack } from '@mui/material'

import UploadButton from './UploadButton'
import FileItemList from './FileItemList'
import { PoolInfoProp } from 'bounceComponents/fixed-swap/type'

export interface AuctionFilesProps {
  canDeleteFile?: boolean
  canDownloadFile?: boolean
  canAddFile?: boolean
  poolInfo: PoolInfoProp
  getPoolInfo: () => void
}

const AuctionFiles = ({ poolInfo, getPoolInfo, canDeleteFile, canDownloadFile, canAddFile }: AuctionFilesProps) => {
  return (
    <Stack spacing={20} sx={{ width: '100%', mt: 20 }}>
      <FileItemList
        poolInfo={poolInfo}
        getPoolInfo={getPoolInfo}
        canDeleteFile={canDeleteFile}
        canDownloadFile={canDownloadFile}
      />
      {canAddFile && !!poolInfo?.posts && poolInfo.posts?.length < 3 ? (
        <UploadButton poolInfo={poolInfo} getPoolInfo={getPoolInfo} />
      ) : null}
    </Stack>
  )
}

export default AuctionFiles
