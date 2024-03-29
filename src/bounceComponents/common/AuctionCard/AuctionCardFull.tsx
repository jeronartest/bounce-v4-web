import Image from 'components/Image'
import AuctionCard, { AuctionHolder, AuctionListItem } from 'bounceComponents/common/AuctionCard'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
import GreenCheck from 'assets/imgs/icon/green_check.svg'
import { VerifyStatus } from 'api/profile/type'
import TokenImage from 'bounceComponents/common/TokenImage'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { getLabelById, shortenAddress } from 'utils'
import ErrorSVG from 'assets/imgs/icon/error_solid.svg'
import { routes } from 'constants/routes'
import BigNumber from 'bignumber.js'
import { Box, Stack, Typography } from '@mui/material'
import { useOptionDatas } from 'state/configOptions/hooks'
import { formatNumber } from 'utils/number'

export default function AuctionCardFull({ auctionPoolItem }: { auctionPoolItem: FixedSwapPool }) {
  const optionDatas = useOptionDatas()
  return (
    <Box
      component={'a'}
      target="_blank"
      href={(auctionPoolItem.category === PoolType.Lottery ? routes.auction.randomSelection : routes.auction.fixedPrice)
        .replace(':chainShortName', getLabelById(auctionPoolItem.chainId, 'shortName', optionDatas?.chainInfoOpt || []))
        .replace(':poolId', auctionPoolItem.poolId)}
    >
      <AuctionCard
        style={{ minWidth: 'unset' }}
        poolId={auctionPoolItem.poolId}
        title={auctionPoolItem.name}
        status={auctionPoolItem.status}
        claimAt={auctionPoolItem.claimAt}
        closeAt={auctionPoolItem.closeAt}
        dateStr={auctionPoolItem.status == 1 ? auctionPoolItem.openAt : auctionPoolItem.closeAt}
        holder={
          <AuctionHolder
            href={`${routes.profile.summary}?id=${auctionPoolItem.creatorUserInfo?.userId}`}
            avatar={auctionPoolItem.creatorUserInfo?.avatar}
            name={auctionPoolItem.creatorUserInfo?.name}
            description={
              (auctionPoolItem.creatorUserInfo?.publicRole?.length || 0) > 0
                ? auctionPoolItem.creatorUserInfo?.publicRole
                    ?.map((item: any, index: number) => {
                      return (
                        getLabelById(item, 'role', optionDatas?.publicRoleOpt) +
                        `${index !== (auctionPoolItem.creatorUserInfo?.publicRole?.length || 0) - 1 ? ', ' : ''}`
                      )
                    })
                    .join(' ') || ''
                : 'Individual account'
            }
            isVerify={auctionPoolItem.creatorUserInfo?.isVerify || VerifyStatus.NoVerify}
          />
        }
        progress={{
          symbol: auctionPoolItem.token0.symbol?.toUpperCase(),
          decimals: auctionPoolItem.token0.decimals.toString(),
          sold: auctionPoolItem.swappedAmount0,
          supply: auctionPoolItem.amountTotal0
        }}
        listItems={
          <>
            <AuctionListItem
              label="Token symbol"
              value={
                <Stack direction="row" alignItems="center" spacing={4}>
                  <TokenImage src={auctionPoolItem.token0.largeUrl} alt={auctionPoolItem.token0.symbol} size={20} />
                  <span>{auctionPoolItem.token0.symbol.toUpperCase()}</span>
                </Stack>
              }
            />
            <AuctionListItem
              label="Contract address"
              value={
                <Stack direction="row" alignItems="center" spacing={4}>
                  {auctionPoolItem.token0.coingeckoId ? (
                    <TokenImage src={GreenCheck} alt="coingecko" size={20} />
                  ) : (
                    <Image src={ErrorSVG} width={16} height={16} alt="Dangerous" />
                  )}
                  <span>{shortenAddress(auctionPoolItem.token0.address)}</span>
                  <CopyToClipboard text={auctionPoolItem.token0.address} />
                </Stack>
              }
            />
            {auctionPoolItem.category !== PoolType.Lottery && (
              <AuctionListItem
                label="Fixed price ratio"
                value={
                  <Stack direction="row" spacing={8}>
                    <Typography fontSize={12}>1</Typography>
                    <Typography fontSize={12}>
                      {auctionPoolItem.token0.symbol.toUpperCase()} ={' '}
                      {new BigNumber(auctionPoolItem.ratio).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
                    </Typography>
                    <Typography fontSize={12}>{auctionPoolItem.token1.symbol.toUpperCase()}</Typography>
                  </Stack>
                }
              />
            )}
            {auctionPoolItem.category === PoolType.Lottery && (
              <AuctionListItem
                label="Ticket Price"
                value={
                  <Stack direction="row" spacing={8}>
                    <Typography fontSize={12}>
                      {formatNumber(auctionPoolItem.maxAmount1PerWallet, {
                        unit: auctionPoolItem.token1.decimals,
                        decimalPlaces: auctionPoolItem.token1.decimals
                      })}
                    </Typography>
                    <Typography fontSize={12}>{auctionPoolItem.token1.symbol.toUpperCase()}</Typography>
                  </Stack>
                }
              />
            )}
            <AuctionListItem
              label="Price,$"
              value={
                <span>
                  {new BigNumber(auctionPoolItem.poolPrice).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
                </span>
              }
            />
          </>
        }
        categoryName={PoolType[auctionPoolItem.category as PoolType]}
        whiteList={auctionPoolItem.enableWhiteList ? 'Whitelist' : 'Public'}
        chainId={auctionPoolItem.chainId}
      />
    </Box>
  )
}
