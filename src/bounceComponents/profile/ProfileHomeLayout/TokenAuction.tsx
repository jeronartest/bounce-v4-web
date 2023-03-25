import { Box, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import Image from 'components/Image'
import AuctionCard, { AuctionHolder, AuctionListItem } from 'bounceComponents/common/AuctionCard'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import { IAuctionPoolsItems, VerifyStatus } from 'api/profile/type'
import TokenImage from 'bounceComponents/common/TokenImage'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { getLabelById, shortenAddress } from 'utils'
import { ReactComponent as NoPoolFoundSVG } from 'assets/imgs/noPoolFound.svg'
import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import { routes } from 'constants/routes'
import { useOptionDatas } from 'state/configOptions/hooks'
import { IProfileUserInfo } from 'api/user/type'
import NoData from 'bounceComponents/common/NoData'
import FormItem from 'bounceComponents/common/FormItem'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import { getPools } from 'api/market'
import BigNumber from 'bignumber.js'

export type IActivitieProps = {
  userInfo: IProfileUserInfo
}
const defaultPageSize = 3
const poolType: Record<PoolType, string> = {
  [PoolType.FixedSwap]: 'Fixed-Price',
  [PoolType.Lottery]: 'Lottery',
  [PoolType.Duch]: 'Dutch Auction',
  [PoolType.SealedBid]: 'SealedBid'
}

const TokenAuction: React.FC<IActivitieProps> = ({ userInfo }) => {
  const optionDatas = useOptionDatas()
  const [curChain, setCurChain] = useState(0)

  const {
    pagination,
    data: auctionPoolData,
    loading
  } = usePagination<IAuctionPoolsItems<FixedSwapPool>, Params>(
    async ({ current, pageSize }) => {
      const category = 1
      const resp = await getPools({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        CreatorUserId: userInfo.id,
        category,
        chainId: curChain,
        orderBy: ''
      })
      if (category === 1) {
        return {
          list: resp.data.fixedSwapList.list,
          total: resp.data.fixedSwapList.total
        }
      } else if (category === 2) {
        return {
          list: resp.data.dutchPoolList.list,
          total: resp.data.dutchPoolList.total
        }
      } else if (category === 3) {
        return {
          list: resp.data.lotteryPoolList.list,
          total: resp.data.lotteryPoolList.total
        }
      } else {
        return {
          list: resp.data.sealedBidPoolList.list,
          total: resp.data.sealedBidPoolList.total
        }
      }
    },
    {
      defaultPageSize,
      refreshDeps: [userInfo.id, curChain]
    }
  )

  const handlePageChange = (_: any, p: number) => {
    pagination.changeCurrent(p)
  }

  return (
    <Box mx={12} mb={48} p={'40px 30px 48px 36px'}>
      <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
        <Typography fontFamily={'"Sharp Grotesk DB Cyr Medium 22"'} fontSize={24}>
          Token & NFT Auction
        </Typography>
        <Stack>
          <FormItem name="chain" label="Chain" sx={{ width: 190 }}>
            <Select value={curChain} onChange={e => setCurChain(Number(e.target?.value) || 0)}>
              <MenuItem key={0} value={0}>
                All Chains
              </MenuItem>
              {optionDatas?.chainInfoOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.chainName.split(' ')[0]}
                </MenuItem>
              ))}
            </Select>
          </FormItem>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BounceAnime />
        </Box>
      ) : !auctionPoolData?.total || auctionPoolData?.total === 0 ? (
        <NoData sx={{ padding: 40 }}>
          <Box display={'grid'} justifyItems="center">
            <NoPoolFoundSVG />
            <Typography fontWeight={500} fontSize={20} mt={10}>
              {userInfo.fullName} {'hasn’t created Auction'}{' '}
            </Typography>
            <Typography>Once they do, those Auctions will show up here.</Typography>
          </Box>
        </NoData>
      ) : (
        <Box mt={20}>
          {auctionPoolData && auctionPoolData?.total > 0 && (
            <Grid container spacing={18}>
              {auctionPoolData?.list?.map((auctionPoolItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                  <Box
                    component={'a'}
                    target="_blank"
                    href={routes.auction.fixedPrice
                      .replace(
                        ':chainShortName',
                        getLabelById(auctionPoolItem.chainId, 'shortName', optionDatas?.chainInfoOpt)
                      )
                      .replace(':poolId', auctionPoolItem.poolId)}
                  >
                    <AuctionCard
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
                                      `${
                                        index !== (auctionPoolItem.creatorUserInfo?.publicRole?.length || 0) - 1 && ', '
                                      }`
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
                                <TokenImage
                                  src={auctionPoolItem.token0.largeUrl}
                                  alt={auctionPoolItem.token0.symbol}
                                  size={20}
                                />
                                <span>{auctionPoolItem.token0.symbol.toUpperCase()}</span>
                              </Stack>
                            }
                          />
                          <AuctionListItem
                            label="Contract address"
                            value={
                              <Stack direction="row" alignItems="center" spacing={4}>
                                {auctionPoolItem.token0.coingeckoId ? (
                                  <TokenImage src={CoingeckoSVG} alt="coingecko" size={20} />
                                ) : (
                                  <Image src={ErrorSVG} width={20} height={20} alt="Dangerous" />
                                )}
                                <span>{shortenAddress(auctionPoolItem.token0.address)}</span>
                                <CopyToClipboard text={auctionPoolItem.token0.address} />
                              </Stack>
                            }
                          />
                          <AuctionListItem
                            label="Fixed price ratio"
                            value={
                              <Stack direction="row" spacing={8}>
                                <Typography fontSize={12}>1</Typography>
                                <Typography fontSize={12}>
                                  {auctionPoolItem.token0.symbol.toUpperCase()} ={' '}
                                  {new BigNumber(auctionPoolItem.ratio)
                                    .decimalPlaces(6, BigNumber.ROUND_DOWN)
                                    .toFormat()}
                                </Typography>
                                <Typography fontSize={12}>{auctionPoolItem.token1.symbol.toUpperCase()}</Typography>
                              </Stack>
                            }
                          />
                          <AuctionListItem
                            label="Price,$"
                            value={
                              <span>
                                {new BigNumber(auctionPoolItem.poolPrice)
                                  .decimalPlaces(6, BigNumber.ROUND_DOWN)
                                  .toFormat()}
                              </span>
                            }
                          />
                        </>
                      }
                      categoryName={poolType[auctionPoolItem.category as PoolType]}
                      whiteList={auctionPoolItem.enableWhiteList ? 'Whitelist' : 'Public'}
                      chainId={auctionPoolItem.chainId}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <Box mt={40} display={'flex'} justifyContent="center">
        <Pagination
          onChange={handlePageChange}
          sx={{ '.MuiPagination-ul li button': { border: '1px solid' }, alignItems: 'end' }}
          count={Math.ceil((auctionPoolData?.total || 0) / (defaultPageSize || 0))}
        />
      </Box>
    </Box>
  )
}

export default TokenAuction
