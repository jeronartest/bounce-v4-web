import { Box, Button, Grid, MenuItem, Pagination, PaginationItem, Select, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Image from 'components/Image'
import AuctionCard, { AuctionListItem } from 'bounceComponents/common/AuctionCard'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import { IAuctionPoolsData, IAuctionPoolsItems } from 'api/profile/type'
import { getUserActivitiesPool } from 'api/profile'
import TokenImage from 'bounceComponents/common/TokenImage'
import { PoolType } from 'api/pool/type'
import { getLabelById, shortenAddress } from 'utils'
import { ReactComponent as NoPoolFoundSVG } from 'assets/imgs/noPoolFound.svg'
import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import { routes } from 'constants/routes'
import { useOptionDatas } from 'state/configOptions/hooks'
import { IProfileUserInfo } from 'api/user/type'
import NoData from 'bounceComponents/common/NoData'
import FormItem from 'bounceComponents/common/FormItem'

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
  const [btnSta, setBtnSta] = useState<string>('Auction')
  const optionDatas = useOptionDatas()
  const [curChain, setCurChain] = useState(0)
  const { pagination, data: auctionPoolData } = usePagination<IAuctionPoolsItems<IAuctionPoolsData>, Params>(
    async ({ current, pageSize }) => {
      if (userInfo) {
        const resp = await getUserActivitiesPool({
          offset: (current - 1) * pageSize,
          limit: pageSize,
          userId: userInfo.id
        })
        return {
          total: resp.data.total,
          list: resp.data.list
        }
      }
      return {
        total: 0,
        list: []
      }
    },
    {
      ready: !!userInfo.id,
      defaultPageSize: defaultPageSize,
      refreshDeps: [userInfo.id]
    }
  )

  const handlePageChange = (_: any, p: number) => {
    pagination.changeCurrent(p)
  }
  if (!auctionPoolData?.total) {
    return (
      <NoData>
        <Box>
          <Typography textAlign={'center'} fontWeight={500} fontSize={20}>
            {userInfo.fullName} {'hasn’t created Auction'}{' '}
          </Typography>
          <Typography textAlign={'center'}>Once they do, those Auctions will show up here.</Typography>
        </Box>
      </NoData>
    )
  }

  return (
    <Box mx={12} mt={48} mb={48} p={'52px 30px 48px 36px'} bgcolor={'var(--ps-gray-50)'} borderRadius={20}>
      <Box display={'flex'} justifyContent="space-between">
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
      <Box display={'flex'} justifyContent={'space-between'} mt={30} mb={16}>
        <Stack direction="row" spacing={10}>
          <Button
            variant={btnSta === 'Auction' ? 'contained' : 'outlined'}
            onClick={() => {
              setBtnSta('Auction')
            }}
          >
            Auction Pool {`(${Number(auctionPoolData?.total) || 0})`}
          </Button>
        </Stack>
        <Stack direction="row">
          {auctionPoolData && auctionPoolData?.total <= defaultPageSize ? (
            <></>
          ) : (
            <Pagination
              onChange={handlePageChange}
              sx={{ '.MuiPagination-ul li button': { border: '1px solid' }, alignItems: 'end' }}
              count={Math.ceil((auctionPoolData?.total || 0) / (defaultPageSize || 0))}
              renderItem={item => {
                if (item.type === 'previous' || item.type === 'next') {
                  return <PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                }
                return null
              }}
            />
          )}
        </Stack>
      </Box>
      <Box>
        {auctionPoolData && auctionPoolData?.total > 0 ? (
          <Grid container spacing={18}>
            {auctionPoolData?.list?.map((auctionPoolItem, index) => (
              <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                <Box
                  component={'a'}
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
        ) : (
          <Box width={300} pt={33} textAlign={'center'} margin={'0 auto'}>
            <NoPoolFoundSVG />
            <Typography mt={20} variant="body1" fontSize={20} color={'#908E96'}>
              No pool found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default TokenAuction
