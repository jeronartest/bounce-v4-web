import { H3, H4 } from '../../../components/Text'
import { Box, Container, Grid, MenuItem, Select, Skeleton } from '@mui/material'
import React, { useState } from 'react'
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
import { CenterRow, Row } from '../../../components/Layout'
import { AuctionOptions } from '../NotableAuction'

export const Notable1155: React.FC = () => {
  const optionDatas = useOptionDatas()
  const [auction, setAuction] = useState(AuctionOptions[0])
  const [chainFilter, setChainFilter] = useState<string | number>(0)
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
    <Box sx={{ background: 'white', padding: '80px 0 100px' }}>
      <Container>
        <H3 justifyContent={'center'}>Notable Auctions</H3>
        <CenterRow justifyContent={'space-between'} mt={40}>
          <H4 mb={33}>ERC1155</H4>
          <Row gap={8}>
            <Select
              sx={{
                width: '200px',
                height: '38px'
              }}
              value={auction}
              onChange={e => setAuction(e.target.value)}
            >
              {AuctionOptions.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                width: '200px',
                height: '38px'
              }}
              value={chainFilter}
              onChange={e => setChainFilter(e.target.value)}
            >
              <MenuItem key={0} value={0}>
                All Chains
              </MenuItem>
              {optionDatas?.chainInfoOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.chainName}
                </MenuItem>
              ))}
            </Select>
          </Row>
        </CenterRow>
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
            grayArrow
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
      </Container>
    </Box>
  )
}
