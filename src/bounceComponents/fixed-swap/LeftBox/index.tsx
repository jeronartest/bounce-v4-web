import { Box, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { BigNumber } from 'bignumber.js'
import Image from 'components/Image'
import PoolInfoItem from '../PoolInfoItem'
import TokenImage from 'bounceComponents/common/TokenImage'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'

import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import ErrorSVG from 'assets/imgs/icon/error_outline.svg'
import PoolProgress from 'bounceComponents/common/PoolProgress'
import { AuctionProgressPrimaryColor } from 'constants/auction/color'
import { shortenAddress } from 'utils'
import { FixedSwapPoolProp } from 'api/pool/type'

const Title = ({ children }: { children: ReactNode }): JSX.Element => (
  <Typography variant="h6" sx={{ mb: 10 }}>
    {children}
  </Typography>
)

const LeftBox = ({ poolInfo }: { poolInfo: FixedSwapPoolProp }): JSX.Element => {
  const swapedPercent = poolInfo?.swappedAmount0
    ? new BigNumber(poolInfo.swappedAmount0).div(poolInfo.amountTotal0).times(100).toNumber()
    : undefined

  return (
    <Box sx={{ borderRadius: 20, bgcolor: '#F5F5F5', px: 16, py: 36, flex: 1, height: 'fit-content' }}>
      <Stack spacing={36}>
        <Stack spacing={10}>
          <Title>Token Information</Title>

          <PoolInfoItem title="Contact address" tip="Token Contract Address.">
            <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
              {poolInfo.token0.coingeckoId ? (
                <Image src={CoingeckoSVG} width={20} height={20} alt="coingecko" />
              ) : (
                <Image src={ErrorSVG} width={20} height={20} alt="Dangerous" />
              )}

              <Typography>{shortenAddress(poolInfo.token0.address)}</Typography>

              <CopyToClipboard text={poolInfo.token0.address} />
            </Stack>
          </PoolInfoItem>

          <PoolInfoItem title="Token symbol">
            <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
              <TokenImage src={poolInfo.token0.largeUrl} alt={poolInfo.token0.symbol} size={20} />
              <Typography>{poolInfo.token0.symbol}</Typography>
            </Stack>
          </PoolInfoItem>
        </Stack>

        <Stack spacing={10}>
          <Title>Auction Information</Title>

          <PoolInfoItem title="Auction type">Fixed-Price</PoolInfoItem>
          <PoolInfoItem title="Participant">{poolInfo.enableWhiteList ? 'Whitelist' : 'Public'}</PoolInfoItem>
          <PoolInfoItem title="Allocation per Wallet">
            {poolInfo.currencyMaxAmount1PerWallet.toSignificant()}
          </PoolInfoItem>
          <PoolInfoItem title="Total available Amount">
            {poolInfo.currencyAmount0.toSignificant()} {poolInfo.token0.symbol}
          </PoolInfoItem>
          <PoolInfoItem title="Price per unit, $">
            {new BigNumber(poolInfo.poolPrice).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
          </PoolInfoItem>
        </Stack>

        <Box>
          <PoolInfoItem title="Progress">
            <Box>
              <Typography component="span" sx={{ color: AuctionProgressPrimaryColor[poolInfo.status] }}>
                {poolInfo.currencySwappedAmount0.toSignificant()} {poolInfo.token0.symbol}
              </Typography>
              <Typography component="span">
                &nbsp;/ {poolInfo.currencyAmount0.toSignificant()} {poolInfo.token0.symbol}
              </Typography>
            </Box>
          </PoolInfoItem>

          <PoolProgress value={swapedPercent} sx={{ mt: 12 }} poolStatus={poolInfo.status} />
        </Box>
      </Stack>
    </Box>
  )
}

export default LeftBox
