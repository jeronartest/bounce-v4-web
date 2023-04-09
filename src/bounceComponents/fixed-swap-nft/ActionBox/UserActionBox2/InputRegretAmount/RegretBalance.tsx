import { Box, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'
import { formatNumber } from 'utils/number'

const RegretBalance = ({ poolInfo }: FixedSwapPoolParams) => {
  const formattedRegretBalance = poolInfo?.participant.swappedAmount0
    ? formatNumber(poolInfo?.participant.swappedAmount0, {
        unit: poolInfo.token0.decimals
      })
    : '0'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5">Regret Amount</Typography>
      <Tooltip title="You can regret your participation and get the amount of fund back.">
        <HelpOutlineIcon sx={{ width: 20, height: 20, ml: 4 }} />
      </Tooltip>
      <Typography sx={{ ml: 'auto' }}>
        Regret Balance: {formattedRegretBalance} {poolInfo.token0.symbol}
      </Typography>
    </Box>
  )
}

export default RegretBalance
