import { ButtonBase } from '@mui/material'
import { useRequest } from 'ahooks'

import MaskIcon from './MaskIcon'
import FileIcon from './FileIcon'
import { ReactComponent as DeleteSVG } from 'assets/imgs/icon/delete.svg'

import { UpdateAuctionBackgroundParams } from 'api/pool/type'
import { updateAuctionBackground } from 'api/pool'
import { shouldFileTypeShowIcon } from 'utils/file'
import { PoolInfoProp } from 'bounceComponents/fixed-swap/type'

export interface DownloadFileButtonProps {
  fileId?: number
  fileType?: string
  thumbnailUrl?: string
  fileUrl?: string
  poolInfo: PoolInfoProp
  getPoolInfo: () => void
}

const DeleteFileButton = ({
  poolInfo,
  getPoolInfo,
  fileId,
  fileType,
  thumbnailUrl,
  fileUrl
}: DownloadFileButtonProps) => {
  const { run: update } = useRequest((params: UpdateAuctionBackgroundParams) => updateAuctionBackground(params), {
    manual: true,
    onSuccess: () => {
      getPoolInfo()
    }
  })

  return (
    <ButtonBase
      sx={{
        width: 52,
        height: 52,
        borderRadius: 10,
        position: 'relative',
        '&:hover div': {
          display: 'flex'
        },
        border: fileType && shouldFileTypeShowIcon(fileType) ? '1px solid #D7D6D9' : undefined
      }}
      onClick={() => {
        update({
          id: Number(poolInfo.id),
          description: poolInfo?.description,
          posts: poolInfo?.posts?.filter(post => post.id !== fileId)
        })
      }}
    >
      <FileIcon fileType={fileType} thumbnailUrl={thumbnailUrl} fileUrl={fileUrl} />

      <MaskIcon>
        <DeleteSVG />
      </MaskIcon>
    </ButtonBase>
  )
}

export default DeleteFileButton
