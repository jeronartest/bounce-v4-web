import React, { useState } from 'react'
import { Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useRequest } from 'ahooks'

import Uploader from '@/components/common/Uploader'
import { ReactComponent as AddCircleOutlineSVG } from 'assets/imgs/icon/add_circle_outline.svg'

import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { updateAuctionBackground } from '@/api/pool'
import { UpdateAuctionBackgroundParams } from '@/api/pool/type'

export interface UploadButtonProps {
  poolId: number
}

const UploadButton = ({ poolId }: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false)

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  const { run: update, loading: isUpdating } = useRequest(
    (params: UpdateAuctionBackgroundParams) => updateAuctionBackground(params),
    {
      manual: true,
      onSuccess: () => {
        setIsUploading(false)
        getPoolInfo()
      }
    }
  )

  return (
    <LoadingButton variant="outlined" sx={{ p: 0 }} fullWidth loading={isUploading || isUpdating}>
      <Uploader
        sx={{ width: '100%', height: '100%' }}
        limitSize={50}
        onBefore={file => {
          setIsUploading(true)
          return Promise.resolve(file)
        }}
        onSuccess={res => {
          setIsUploading(false)
          update({
            id: poolId,
            description: poolInfo?.description,
            posts: [...poolInfo.posts, { ...res, fileSize: Number(res.fileSize), id: 0 }]
          })
        }}
        onError={() => {
          setIsUploading(false)
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Add File
          <AddCircleOutlineSVG style={{ marginLeft: '8px' }} />
        </Box>
      </Uploader>
    </LoadingButton>
  )
}

export default UploadButton
