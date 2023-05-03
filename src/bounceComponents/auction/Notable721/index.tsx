import { H4 } from '../../../components/Text'
import { Box, Button, Container, Grid, Skeleton } from '@mui/material'
import { SlideProgress } from '../SlideProgress'
import { routes } from '../../../constants/routes'
import { getLabelById } from '../../../utils'
import { NFTCard } from '../../../pages/market/nftAuctionPool'
import { useOptionDatas } from '../../../state/configOptions/hooks'
import { useRequest } from 'ahooks'
import { getPools } from '../../../api/market'
import { FixedSwapPool } from '../../../api/pool/type'
import { SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
interface Notable721Props {
  handleViewAll?: () => void
}
export const Notable721 = (props: Notable721Props) => {
  const { handleViewAll } = props
  const optionDatas = useOptionDatas()
  const { data, loading } = useRequest(async () => {
    const resp = await getPools({
      offset: 0,
      limit: 4,
      category: 5,
      chainId: 2,
      creatorAddress: '',
      creatorName: '',
      orderBy: 'openTs',
      poolId: '',
      poolName: '',
      tokenType: 2, // erc20:1, nft:2
      token0Address: ''
    })
    return {
      list: resp.data.fixedSwapNftList.list,
      total: resp.data.fixedSwapNftList.total
    }
  })
  return (
    <Box sx={{ padding: '80px 0 100px' }}>
      <Container>
        <H4 mb={33}>ERC721</H4>
        {loading ? (
          <Grid container spacing={18}>
            {Array.from(new Array(4)).map((lodingItem, index) => (
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3} key={index}>
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={400}
                  sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <SlideProgress
            swiperStyle={{
              spaceBetween: 20,
              slidesPerView: 4,
              loop: false
            }}
          >
            {data
              ? data.list.map((item: FixedSwapPool, idx: number) => (
                  <SwiperSlide key={idx}>
                    <Box style={{ width: '309px' }}>
                      <Link
                        to={routes.auction.fixedSwapNft
                          .replace(
                            ':chainShortName',
                            getLabelById(item.chainId, 'shortName', optionDatas?.chainInfoOpt || [])
                          )
                          .replace(':poolId', item.poolId)}
                      >
                        <NFTCard nft={item} hiddenStatus={true} />
                      </Link>
                    </Box>
                  </SwiperSlide>
                ))
              : []}
          </SlideProgress>
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '40px 0 160px'
          }}
        >
          <Button
            onClick={() => {
              handleViewAll && handleViewAll()
            }}
            // href={AuctionList[currentIndex].checkAllLink}
            sx={{
              background: 'var(--ps-yellow-1)',
              padding: '16px 20px'
            }}
          >
            View all auctions
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
