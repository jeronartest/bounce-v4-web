import React from 'react'
import { ButtonBase } from '@mui/material'
import { useRequest } from 'ahooks'

import MaskIcon from './MaskIcon'
import FileIcon from './FileIcon'
import { ReactComponent as DeleteSVG } from 'assets/imgs/icon/delete.svg'

import { UpdateAuctionBackgroundParams } from '@/api/pool/type'
import { updateAuctionBackground } from '@/api/pool'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { shouldFileTypeShowIcon } from '@/utils/file'

export interface DownloadFileButtonProps {
  poolId: number
  fileId?: number
  fileType?: string
  thumbnailUrl?: string
  fileUrl?: string
}

const DeleteFileButton = ({ poolId, fileId, fileType, thumbnailUrl, fileUrl }: DownloadFileButtonProps) => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

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
        border: shouldFileTypeShowIcon(fileType) ? '1px solid #D7D6D9' : undefined
      }}
      onClick={() => {
        update({
          id: poolId,
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
