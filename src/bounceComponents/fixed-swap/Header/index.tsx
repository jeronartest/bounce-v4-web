import { Box, Stack, Typography } from '@mui/material'
import Image from 'components/Image'
import LikeUnlike from 'bounceComponents/common/LikeUnlike'
import { LIKE_OBJ } from 'api/idea/type'
import { ChainListMap } from 'constants/chain'
import { FixedSwapPoolProp } from 'api/pool/type'

const styles = {
  p: '7px 16px',
  borderRadius: '50px',
  background: '#FFFFFF',
  '&:hover': {
    background: '#FFFFFF'
  }
}

const Header = ({ poolInfo, getPoolInfo }: { poolInfo: FixedSwapPoolProp; getPoolInfo: () => void }): JSX.Element => {
  if (!poolInfo.ethChainId) return <></>
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
            myLike: poolInfo?.likeInfo?.myLike
          }}
          onSuccess={getPoolInfo}
          likeSx={{
            ...styles,
            '&:hover': {
              color: '#259C4A',
              background: '#FFFFFF'
            }
          }}
          unlikeSx={{
            ...styles,
            '&:hover': {
              color: '#CA2020',
              background: '#FFFFFF'
            }
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
            py: 6
          }}
        >
          <Image src={ChainListMap[poolInfo.ethChainId]?.logo || ''} width={20} height={20} />
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: '20px' }}>
            {ChainListMap[poolInfo.ethChainId]?.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
