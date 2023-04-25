import { useEffect, useState } from 'react'
import { Box, ButtonBase, IconButton, OutlinedInput, Typography } from '@mui/material'
import { useRequest } from 'ahooks'

import { updateAuctionBackground } from 'api/pool'
import { UpdateAuctionBackgroundParams } from 'api/pool/type'

import { ReactComponent as EditSVG } from 'assets/imgs/icon/edit.svg'
import { PoolInfoProp } from '../type'

export interface AuctionDescriptionProps {
  poolInfo: PoolInfoProp
  canEdit?: boolean
  getPoolInfo: () => void
}

const MAX_DESCRIPTION_CHARACTER_COUNT = 350

const AuctionDescription = ({ poolInfo, getPoolInfo, canEdit = false }: AuctionDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(poolInfo?.description || 'No description')

  const { run: update, loading: isUpdating } = useRequest(
    (params: UpdateAuctionBackgroundParams) => updateAuctionBackground(params),
    {
      manual: true,
      onSuccess: () => {
        setIsEditing(false)
        getPoolInfo()
      }
    }
  )

  useEffect(() => {
    setInputValue(poolInfo?.description || 'No description')
  }, [poolInfo?.description])

  return (
    <Box sx={{ mt: 26, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <Typography variant="h5">Auction Background</Typography>

        {canEdit ? (
          !isEditing ? (
            <IconButton
              onClick={() => {
                setIsEditing(true)
              }}
            >
              <EditSVG />
            </IconButton>
          ) : (
            <ButtonBase
              disabled={isUpdating}
              onClick={() => {
                update({ id: poolInfo.id, description: inputValue, posts: poolInfo?.posts || undefined })
              }}
            >
              <Typography color="#2663FF">Save</Typography>
            </ButtonBase>
          )
        ) : null}
      </Box>

      <Box sx={{ mt: 7 }}>
        {canEdit && isEditing ? (
          <Box sx={{ position: 'relative' }}>
            <OutlinedInput
              sx={{ pb: '40px !important', color: '#878A8E' }}
              fullWidth
              multiline
              value={inputValue}
              onChange={event => {
                if (event.target.value?.length > MAX_DESCRIPTION_CHARACTER_COUNT) return
                setInputValue(event.target.value)
              }}
            />
            <Typography variant="body2" sx={{ position: 'absolute', right: 16, bottom: 16, color: '#878A8E' }}>
              {inputValue.length} / {MAX_DESCRIPTION_CHARACTER_COUNT}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: '#878A8E' }}>
            {inputValue}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default AuctionDescription
