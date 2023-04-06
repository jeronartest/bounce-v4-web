import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import { BigNumber } from 'bignumber.js'
import Image from 'next/image'
import PoolInfoItem from '../PoolInfoItem'
import TokenImage from 'bounceComponents/common/TokenImage'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'

import { shortenAddress } from '@/utils/web3/address'
import { formatNumber } from '@/utils/web3/number'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'

import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import ErrorSVG from 'assets/imgs/icon/error_outline.svg'
import PoolProgress from 'bounceComponents/common/PoolProgress'
import { AuctionProgressPrimaryColor } from '@/constants/auction/color'
import DefaultNftIcon from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'

const Title = ({ children }: { children: ReactNode }): JSX.Element => (
  <Typography variant="h6" sx={{ mb: 10 }}>
    {children}
  </Typography>
)

const LeftBox = (): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()

  const formatedAmountTotal0 = poolInfo?.token0
    ? formatNumber(poolInfo?.amountTotal0, {
        unit: poolInfo.token0.decimals,
        decimalPlaces: 6
      })
    : '-'
  const formatedSwappedAmount0 = poolInfo?.swappedAmount0
    ? formatNumber(poolInfo.swappedAmount0, {
        unit: poolInfo.token0.decimals,
        decimalPlaces: 6
      })
    : '-'
  const formatedMaxAmount1PerWallet =
    poolInfo?.maxAmount1PerWallet &&
    poolInfo.maxAmount1PerWallet !== '0' &&
    poolInfo.maxAmount1PerWallet !== poolInfo.amountTotal0
      ? `${formatNumber(poolInfo.maxAmount1PerWallet, {
          unit: poolInfo.token1.decimals,
          decimalPlaces: 6
        })} ${poolInfo.token1.symbol}`
      : 'No'
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
              <TokenImage
                src={
                  poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon.src
                }
                alt={poolInfo.token0.symbol}
                size={20}
              />
              <Typography>{poolInfo.token0.symbol}</Typography>
            </Stack>
          </PoolInfoItem>
        </Stack>

        <Stack spacing={10}>
          <Title>Auction Information</Title>

          <PoolInfoItem title="Auction type">Fixed-Swap</PoolInfoItem>
          <PoolInfoItem title="Participant">{poolInfo.enableWhiteList ? 'Whitelist' : 'Public'}</PoolInfoItem>
          <PoolInfoItem title="Allocation per Wallet">{formatedMaxAmount1PerWallet}</PoolInfoItem>
          <PoolInfoItem title="Total available Amount">
            {formatedAmountTotal0} {poolInfo.token0.symbol}
          </PoolInfoItem>
          <PoolInfoItem title="Price per unit, $">
            {new BigNumber(poolInfo.poolPrice).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
          </PoolInfoItem>
        </Stack>

        <Box>
          <PoolInfoItem title="Progress">
            <Box>
              <Typography component="span" sx={{ color: AuctionProgressPrimaryColor[poolInfo.status] }}>
                {formatedSwappedAmount0} {poolInfo.token0.symbol}
              </Typography>
              <Typography component="span">
                &nbsp;/ {formatedAmountTotal0} {poolInfo.token0.symbol}
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
