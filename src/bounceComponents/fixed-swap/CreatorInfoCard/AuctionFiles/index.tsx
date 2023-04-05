import { Stack } from '@mui/material'

import UploadButton from './UploadButton'
import FileItemList from './FileItemList'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'

export interface AuctionFilesProps {
  poolId: number
  canDeleteFile?: boolean
  canDownloadFile?: boolean
  canAddFile?: boolean
}

const AuctionFiles = ({ poolId, canDeleteFile, canDownloadFile, canAddFile }: AuctionFilesProps) => {
  const { data: poolInfo } = usePoolInfo()

  return (
    <Stack spacing={20} sx={{ width: '100%', mt: 20 }}>
      <FileItemList poolId={poolId} canDeleteFile={canDeleteFile} canDownloadFile={canDownloadFile} />
      {canAddFile && !!poolInfo?.posts && poolInfo.posts?.length < 3 ? <UploadButton poolId={poolId} /> : null}
    </Stack>
  )
}

export default AuctionFiles
