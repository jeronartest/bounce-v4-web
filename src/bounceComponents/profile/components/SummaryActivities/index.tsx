import { Box, Button, Grid, Pagination, PaginationItem, Stack, Typography } from '@mui/material'
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
import { IIdeasListData, IIdeasListItems } from 'api/idea/type'
import { getIdeasList } from 'api/idea'
import InstitutionCard from 'bounceComponents/companies/InstitutionCard'
// import NoData from 'bounceComponents/common/NoData'
import { getLabel, shortenAddress } from 'utils'
import { ReactComponent as NoPoolFoundSVG } from 'assets/imgs/noPoolFound.svg'
import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import { useOptionDatas } from 'state/configOptions/hooks'
import { routes } from 'constants/routes'
import { Link } from 'react-router-dom'

export type IActivitieProps = {
  personalInfoId: number
}
const defaultPageSize = 3
const defaultIdeaPageSize = 4
const poolType: Record<PoolType, string> = {
  [PoolType.FixedSwap]: 'Fixed-Price',
  [PoolType.Lottery]: 'Lottery',
  [PoolType.Duch]: 'Dutch Auction',
  [PoolType.SealedBid]: 'SealedBid'
}

const Activitie: React.FC<IActivitieProps> = ({ personalInfoId }) => {
  const optionDatas = useOptionDatas()
  const [btnSta, setBtnSta] = useState<string>('Auction')
  const { pagination, data: auctionPoolData } = usePagination<IAuctionPoolsItems<IAuctionPoolsData>, Params>(
    async ({ current, pageSize }) => {
      if (personalInfoId) {
        const resp = await getUserActivitiesPool({
          offset: (current - 1) * pageSize,
          limit: pageSize,
          userId: personalInfoId
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
      ready: !!personalInfoId,
      defaultPageSize: defaultPageSize,
      refreshDeps: [personalInfoId]
    }
  )

  const {
    pagination: ideaPagination,
    data: ideaListData,
    refresh
  } = usePagination<IIdeasListItems<IIdeasListData>, Params>(
    async ({ current, pageSize }) => {
      if (personalInfoId) {
        const resp = await getIdeasList({
          offset: (current - 1) * pageSize,
          limit: pageSize,
          UserId: personalInfoId
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
      ready: !!personalInfoId,
      defaultPageSize: defaultIdeaPageSize,
      refreshDeps: [personalInfoId]
    }
  )
  const handlePageChange = (_: any, p: number) => {
    if (btnSta === 'Auction') {
      pagination.changeCurrent(p)
    } else {
      ideaPagination.changeCurrent(p)
    }
  }
  if (!auctionPoolData?.total && !ideaListData?.total) {
    return <></>
  }

  return (
    <Box mx={12} mt={48} mb={48} p={'52px 30px 48px 36px'} bgcolor={'var(--ps-gray-50)'} borderRadius={20}>
      <Typography fontFamily={'"Sharp Grotesk DB Cyr Medium 22"'} fontSize={24}>
        Activities
      </Typography>
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
          <Button
            variant={btnSta === 'Idea' ? 'contained' : 'outlined'}
            onClick={() => {
              setBtnSta('Idea')
            }}
          >
            Startup Ideas {`(${Number(ideaListData?.total) || 0})`}
          </Button>
        </Stack>
        <Stack direction="row">
          {btnSta === 'Auction' ? (
            auctionPoolData && auctionPoolData?.total <= defaultPageSize ? (
              <></>
            ) : (
              <Pagination
                onChange={handlePageChange}
                sx={{ '.MuiPagination-ul li button': { border: '1px solid' }, alignItems: 'end' }}
                count={Math.ceil(auctionPoolData?.total || 0 / defaultPageSize || 0)}
                renderItem={item => {
                  if (item.type === 'previous' || item.type === 'next') {
                    return <PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                  }
                  return null
                }}
              />
            )
          ) : btnSta === 'Ideas' ? (
            ideaListData && ideaListData?.total <= defaultIdeaPageSize ? (
              <></>
            ) : (
              <Pagination
                onChange={handlePageChange}
                sx={{ '.MuiPagination-ul li button': { border: '1px solid' }, alignItems: 'end' }}
                count={Math.ceil(ideaListData?.total || 0 / defaultIdeaPageSize || 0)}
                renderItem={item => {
                  if (item.type === 'previous' || item.type === 'next') {
                    return <PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                  }
                  return null
                }}
              />
            )
          ) : (
            <></>
          )}
        </Stack>
      </Box>
      {btnSta === 'Auction' ? (
        <Box>
          {auctionPoolData && auctionPoolData?.total > 0 ? (
            <Grid container spacing={18}>
              {auctionPoolData?.list?.map((auctionPoolItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                  <Box
                    component={'a'}
                    target="_blank"
                    href={`${routes.auction.fixedPrice}/${getLabel(
                      auctionPoolItem.chainId,
                      'shortName',
                      optionDatas?.chainInfoOpt
                    )}/${Number(auctionPoolItem.poolId)}`}
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
      ) : (
        <Box>
          {ideaListData && ideaListData?.total > 0 ? (
            <Grid container spacing={18}>
              {ideaListData?.list?.map((ideaListItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                  <Link to={`${routes.idea.detail}?id=${ideaListItem?.id}`}>
                    <InstitutionCard
                      icon={ideaListItem.avatar}
                      status={ideaListItem.marketType}
                      title={ideaListItem.FullName}
                      ideaTitle={ideaListItem.title}
                      isVerify={ideaListItem.isVerify}
                      desc={ideaListItem.summary}
                      likeAmount={{
                        dislikeCount: ideaListItem.dislikeCount,
                        likeCount: ideaListItem.likeCount,
                        myDislike: ideaListItem.myDislike,
                        myLike: ideaListItem.myLike
                      }}
                      acitve={ideaListItem.active}
                      objId={ideaListItem.id}
                      refresh={refresh}
                      commentCount={ideaListItem.commentCount}
                      publicRole={ideaListItem.publicRole}
                      companyState={ideaListItem?.companyState}
                      startup={ideaListItem?.startup}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box width={300} pt={33} textAlign={'center'} margin={'0 auto'}>
              <NoPoolFoundSVG />
              <Typography mt={20} variant="body1" fontSize={20} color={'#908E96'}>
                No idea found
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Activitie
