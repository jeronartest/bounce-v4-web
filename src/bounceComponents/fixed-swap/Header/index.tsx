import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { CHAIN_ICONS, CHAIN_NAMES } from '@/constants/web3/chains'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'
import usePoolInfo from '@/hooks/auction/usePoolInfo'
import TokenImage from '@/components/common/TokenImage'
import LikeUnlike from '@/components/common/LikeUnlike'
import { LIKE_OBJ } from '@/api/idea/type'

const styles = {
  p: '7px 16px',
  borderRadius: '50px',
  background: '#FFFFFF',
  '&:hover': {
    background: '#FFFFFF',
  },
}

const Header = (): JSX.Element => {
  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()
  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack direction="row" spacing={20} sx={{ alignItems: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: 30 }}>
          {poolInfo?.name} Fixed-Price Pool
        </Typography>

        <LikeUnlike
          likeObj={LIKE_OBJ.pool}
          objId={poolInfo?.id}
          likeAmount={{
            dislikeCount: poolInfo?.likeInfo?.dislikeCount,
            likeCount: poolInfo?.likeInfo?.likeCount,
            myDislike: poolInfo?.likeInfo?.myDislike,
            myLike: poolInfo?.likeInfo?.myLike,
          }}
          onSuccess={getPoolInfo}
          likeSx={{
            ...styles,
            '&:hover': {
              color: '#259C4A',
              background: '#FFFFFF',
            },
          }}
          unlikeSx={{
            ...styles,
            '&:hover': {
              color: '#CA2020',
              background: '#FFFFFF',
            },
          }}
        />
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ fontSize: 20, lineHeight: '20px' }}>
          #{poolInfo?.poolId}
        </Typography>
        <Box
          sx={{
            borderRadius: 20,
            bgcolor: '#fff',
            ml: 6,
            display: 'flex',
            alignItems: 'center',
            columnGap: 6,
            px: 10,
            py: 6,
          }}
        >
          {!!chainConfig?.ethChainId && (
            <Image src={CHAIN_ICONS[chainConfig?.ethChainId]} alt={chainConfig?.shortName} width={20} height={20} />
          )}
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: '20px' }}>
            {CHAIN_NAMES[chainConfig?.ethChainId]}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
