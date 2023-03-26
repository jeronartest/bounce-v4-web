import React, { useCallback, useState } from 'react'
import { Favorite, FavoriteBorderOutlined } from '@mui/icons-material'
import { collectToggle } from 'api/idea'
import { Box } from '@mui/material'

interface CollectProps {
  collectionId: number
  defaultCollected: boolean
}

const PoolFavorite: React.FC<CollectProps> = ({ collectionId, defaultCollected }) => {
  const [isCollected, setIsCollected] = useState(defaultCollected)

  const setCollect = useCallback(
    (b: boolean) => {
      collectToggle({ collected: b, collectionId, collectionType: 3 }).then(() => setIsCollected(b))
    },
    [collectionId]
  )

  return (
    <Box display={'flex'} alignItems="center" sx={{ cursor: 'pointer' }}>
      {isCollected ? (
        <Favorite onClick={() => setCollect(false)} />
      ) : (
        <FavoriteBorderOutlined onClick={() => setCollect(true)} />
      )}
    </Box>
  )
}

export default PoolFavorite
