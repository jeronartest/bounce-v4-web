import { Box, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material'
import FormItem from 'bounceComponents/common/FormItem'
import { useEffect, useState } from 'react'
import { useOptionDatas } from 'state/configOptions/hooks'
import { usePagination } from 'ahooks'
import NoData from 'bounceComponents/common/NoData'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import AuctionCardFull from 'bounceComponents/common/AuctionCard/AuctionCardFull'
import { Params } from 'ahooks/lib/usePagination/types'
import { IAuctionPoolsItems } from 'api/profile/type'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { getUserPoolsTokenParticipant } from 'api/account'
import { DashboardQueryType } from 'api/account/types'
import { useActiveWeb3React } from 'hooks'
import AuctionTypeSelect from 'bounceComponents/common/AuctionTypeSelect'
import { NFTCard } from 'pages/market/nftAuctionPool'
import { routes } from 'constants/routes'
import { getLabelById } from 'utils'

const defaultPageSize = 6

export default function ParticipatedTab() {
  const optionDatas = useOptionDatas()
  const [curChain, setCurChain] = useState(0)
  const [queryType, setQueryType] = useState<DashboardQueryType | 0>(0)
  const { account } = useActiveWeb3React()
  const [curPoolType, setCurPoolType] = useState(PoolType.FixedSwap)

  const {
    pagination,
    data: auctionPoolData,
    loading
  } = usePagination<IAuctionPoolsItems<FixedSwapPool>, Params>(
    async ({ current, pageSize }) => {
      if (!account)
        return {
          total: 0,
          list: []
        }
      const category = curPoolType
      // tokenType erc20:1 , erc1155:2
      const tokenType = category === PoolType.fixedSwapNft ? 2 : 1
      const resp: any = await getUserPoolsTokenParticipant({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        category,
        address: account,
        chainId: curChain,
        queryType,
        tokenType
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
      } else if (category === PoolType.fixedSwapNft) {
        return {
          list: resp.data.fixedSwapNftList.list,
          total: resp.data.fixedSwapNftList.total
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
      ready: !!account,
      refreshDeps: [account, curChain, curPoolType, queryType],
      debounceWait: 100
    }
  )

  useEffect(() => {
    pagination.changeCurrent(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, curPoolType, queryType])

  const handlePageChange = (_: any, p: number) => {
    pagination.changeCurrent(p)
  }

  return (
    <Box>
      <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
        <Stack spacing={10} direction="row">
          <FormItem name="chain" label="Chain" sx={{ width: 190 }}>
            <Select value={curChain} onChange={e => setCurChain(Number(e.target?.value) || 0)}>
              <MenuItem key={0} value={0}>
                All Chains
              </MenuItem>
              {optionDatas?.chainInfoOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.chainName}
                </MenuItem>
              ))}
            </Select>
          </FormItem>
          <FormItem name="status" label="Status" sx={{ width: 190 }}>
            <Select value={queryType} onChange={e => setQueryType(Number(e.target?.value) || 0)}>
              <MenuItem key={0} value={0}>
                All
              </MenuItem>
              <MenuItem value={DashboardQueryType.ongoing}>ongoing</MenuItem>
              <MenuItem value={DashboardQueryType.claim}>claim</MenuItem>
            </Select>
          </FormItem>
          <AuctionTypeSelect curPoolType={curPoolType} setCurPoolType={t => setCurPoolType(t)} />
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BounceAnime />
        </Box>
      ) : !auctionPoolData?.total || auctionPoolData?.total === 0 ? (
        <NoData sx={{ padding: 40 }}>
          <Box display={'grid'} justifyItems="center">
            <Typography fontWeight={500} fontSize={20} mt={10}>
              {'Hasn’t participated Auction'}{' '}
            </Typography>
          </Box>
        </NoData>
      ) : (
        <Box mt={20}>
          {auctionPoolData && auctionPoolData?.total > 0 && (
            <Grid container spacing={{ xs: 10, xl: 18 }}>
              {auctionPoolData?.list?.map((auctionPoolItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={index}>
                  {auctionPoolItem.category === PoolType.FixedSwap ? (
                    <AuctionCardFull auctionPoolItem={auctionPoolItem} />
                  ) : (
                    <Box
                      component={'a'}
                      target="_blank"
                      href={routes.auction.fixedSwapNft
                        .replace(
                          ':chainShortName',
                          getLabelById(auctionPoolItem.chainId, 'shortName', optionDatas?.chainInfoOpt || [])
                        )
                        .replace(':poolId', auctionPoolItem.poolId)}
                    >
                      <NFTCard nft={auctionPoolItem} hiddenStatus={true} />
                    </Box>
                  )}
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
