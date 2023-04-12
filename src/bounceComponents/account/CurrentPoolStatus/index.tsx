import { Box, Button, Grid, Pagination, PaginationItem, Stack, Typography } from '@mui/material'
import { DashboardQueryType } from 'api/account/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUserPoolsTokenCreated, useUserPoolsTokenParticipant } from 'bounceHooks/account/useAddressStatus'
import { useActiveWeb3React } from 'hooks'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import NoData from 'bounceComponents/common/NoData'
import AuctionCardFull from 'bounceComponents/common/AuctionCard/AuctionCardFull'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AuctionTypeSelect from 'bounceComponents/common/AuctionTypeSelect'
import { PoolType } from 'api/pool/type'
import { routes } from 'constants/routes'
import { getLabelById } from 'utils'
import { NFTCard } from 'pages/market/nftAuctionPool'
import { useOptionDatas } from 'state/configOptions/hooks'

const StatusText = {
  [DashboardQueryType.ongoing]: 'Ongoing Auctions',
  [DashboardQueryType.claim]: 'Pending Claim'
}

const defaultPageSize = 3
export default function CurrentPoolStatus() {
  const [curQueryType, setCurQueryType] = useState(DashboardQueryType.claim)
  const { account } = useActiveWeb3React()
  const [curPage, setCurPage] = useState(1)
  const [curPoolType, setCurPoolType] = useState(PoolType.FixedSwap)
  const optionDatas = useOptionDatas()

  const { data: createdData, loading: createdLoading } = useUserPoolsTokenCreated(
    account || undefined,
    curQueryType,
    curPoolType
  )
  const { data: participantData, loading: participantDataLoading } = useUserPoolsTokenParticipant(
    account || undefined,
    curQueryType,
    curPoolType
  )

  const curList = useMemo(() => [...(createdData || []), ...(participantData || [])], [createdData, participantData])

  useEffect(() => {
    setCurPage(1)
  }, [account, curPoolType, curQueryType])

  const handlePageChange = useCallback((p: number) => {
    setCurPage(p)
  }, [])

  return (
    <Box
      mt={40}
      padding={'40px 20px 48px'}
      sx={{
        background: '#F5F5F5',
        borderRadius: '20px'
      }}
    >
      <Box display={'flex'} justifyContent="space-between" alignItems={'end'}>
        <Stack direction={'row'} spacing={10}>
          <Button
            variant={curQueryType === DashboardQueryType.ongoing ? 'contained' : 'outlined'}
            onClick={() => {
              setCurQueryType(DashboardQueryType.ongoing)
            }}
          >
            {StatusText[DashboardQueryType.ongoing]}
          </Button>
          <Button
            variant={curQueryType === DashboardQueryType.claim ? 'contained' : 'outlined'}
            onClick={() => {
              setCurQueryType(DashboardQueryType.claim)
            }}
          >
            {StatusText[DashboardQueryType.claim]}
          </Button>
        </Stack>

        <Stack direction={'row'} alignItems={'center'} gap="10px">
          <AuctionTypeSelect curPoolType={curPoolType} setCurPoolType={t => setCurPoolType(t)} />

          <Pagination
            onChange={(_, p) => handlePageChange(p)}
            sx={{ '.MuiPagination-ul li button': { border: '1px solid' }, alignItems: 'end' }}
            count={Math.ceil(curList.length / defaultPageSize)}
            renderItem={item => {
              if (item.type === 'previous' || item.type === 'next') {
                return <PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
              }
              return null
            }}
          />
        </Stack>
      </Box>

      <Box mt={16}>
        {createdLoading || participantDataLoading ? (
          <Box sx={{ width: '100%', height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BounceAnime />
          </Box>
        ) : curList.length === 0 ? (
          <NoData sx={{ padding: '0px 20px' }} widthSvg>
            <Box display={'grid'} justifyItems="center">
              <Typography fontWeight={500} fontSize={20} mt={10}>
                Empty...
              </Typography>
            </Box>
          </NoData>
        ) : (
          <Box mt={20}>
            <Grid container spacing={{ xs: 10, xl: 18 }}>
              {curList
                .slice((curPage - 1) * defaultPageSize, curPage * defaultPageSize)
                .map((auctionPoolItem, index) => (
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
          </Box>
        )}
      </Box>
    </Box>
  )
}
