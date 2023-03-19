import { Box, Button, Container, Grid, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useRequest } from 'ahooks'
import BigNumber from 'bignumber.js'
import styles from './styles'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
import SummaryCard from 'bounceComponents/investment/platform/SummaryCard'
// import NoData from 'bounceComponents/common/NoData'
import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import AuctionCard, { AuctionHolder, AuctionListItem } from 'bounceComponents/common/AuctionCard'
// import NFTLaunchpadCard from 'bounceComponents/common/AuctionCard/NFTLaunchpadCard'
import { getPools } from 'api/market'
import { getLabelById, shortenAddress } from 'utils'
import TokenImage from 'bounceComponents/common/TokenImage'
import { PoolType } from 'api/pool/type'
// import { formatNumber } from '@/utils/web3/number'
import { UserType } from 'api/market/type'
import CompanyBanner from 'bounceComponents/company/CompanyBanner'
import CompanyBanner3 from 'assets/imgs/company/banner/banner1.png'
import CompanyBanner4 from 'assets/imgs/company/banner/banner2.png'
import CompanyBanner5 from 'assets/imgs/company/banner/banner3.png'
import MarketPNG from 'assets/imgs/company/banner/market.png'
import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import Marketcard from 'bounceComponents/investment/marketcard/Marketcard'
import { useOptionDatas } from 'state/configOptions/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import Image from 'components/Image'

// export type IMarketProps = {}

const poolType: Record<PoolType, string> = {
  [PoolType.FixedSwap]: 'Fixed-Price',
  [PoolType.Lottery]: 'Lottery',
  [PoolType.Duch]: 'Dutch Auction',
  [PoolType.SealedBid]: 'SealedBid'
}
const Market: React.FC = ({}) => {
  const navigate = useNavigate()
  const optionDatas = useOptionDatas()
  const { data, loading } = useRequest(async () => {
    const resp = await getPools({
      offset: 0,
      limit: 6,
      category: 1,
      chainId: 0,
      creatorAddress: '',
      creatorName: '',
      orderBy: 'trending',
      poolId: '',
      poolName: '',
      token0Address: ''
    })
    return {
      list: resp.data.fixedSwapList.list,
      total: resp.data.fixedSwapList.total
    }
  })
  const bannerList = [
    {
      img: MarketPNG,
      title: 'Explore the market place & participate in Auctions'
    },
    // {
    //   img: CompanyBanner2,
    //   title: 'Explore everything about  companies and investors in one place',
    // },
    {
      img: CompanyBanner3,
      title: 'Build any type of auction with any tokens permissionlessly'
    },
    {
      img: CompanyBanner4,
      title: 'Launch your NFT through Bounce and activate differernt auction tools'
    },
    {
      img: CompanyBanner5,
      title: 'Bounce Token to boost your market'
    }
  ]
  return (
    <>
      <Container maxWidth="lg">
        <Box mt={60}>
          <CompanyBanner list={bannerList} />
        </Box>
        <Box mt={32}>
          <Stack spacing={26} direction="row">
            <Marketcard
              hover={true}
              title={'Token Auction Pool'}
              imageUrl={'/imgs/investment/platform/tokenPool.svg'}
              handleClick={() => {
                navigate(routes.market.pools)
              }}
            />
            <Marketcard title={'NFT Auction Pool'} imageUrl={'/imgs/investment/platform/nftPool.svg'} />
            <Marketcard title={'NFT Launchpad'} imageUrl={'/imgs/investment/platform/launchpad.svg'} />
            <Marketcard title={'Private Group Auction'} imageUrl={'/imgs/investment/platform/privateAuciton.svg'} />
          </Stack>
        </Box>
        <Box sx={styles.rootPaper}>
          <Box sx={styles.oneStop}>
            <Typography variant="h2" fontSize={24}>
              One-stop Market
            </Typography>
            <Grid container spacing={20} sx={{ pt: 32 }}>
              <Grid
                xs={3}
                item
                onClick={() => {
                  navigate(routes.market.pools)
                }}
              >
                <SummaryCard
                  imageUrl="/imgs/investment/platform/wallet.svg"
                  title="Token Auction Pool"
                  rightSVG={true}
                  description="Token Decentralized Auction platform including Fixed Swap Auction, Dutch Auction and Sealed-Bid Auction."
                />
              </Grid>
              <Grid xs={3} item>
                <SummaryCard
                  active={true}
                  imageUrl="/imgs/investment/platform/nft.svg"
                  title="NFT Auction Pool"
                  description="NFT Decentralized Auction platform including Dutch Auction, English Auction and Lottery Auction."
                />
              </Grid>
              <Grid xs={3} item>
                <SummaryCard
                  active={true}
                  imageUrl="/imgs/investment/platform/asset.svg"
                  title="NFT Launchpad"
                  description="For the new NFT collection to launch. Collectors can mint NFTs at plateform or at project website."
                />
              </Grid>
              <Grid xs={3} item>
                <SummaryCard
                  active={true}
                  imageUrl="/imgs/investment/platform/blockChain.svg"
                  title="Private Group Auction"
                  description="An Exclusive Auction Setting Designed for Privileged Circles"
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={styles.poolsBox}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h2" fontSize={24} color={'#FFFFFF'}>
                Trending Token Auction Pools
              </Typography>
              <Button variant="contained" sx={{ border: ' 1px solid #FFFFFF;' }}>
                <Link to={routes.market.pools}>Explore all</Link>
              </Button>
            </Box>
            <Box mt={18}>
              {loading ? (
                <Grid container spacing={18}>
                  {Array.from(new Array(8)).map((lodingItem, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                      <Box>
                        <Skeleton
                          variant="rounded"
                          height={400}
                          sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={18}>
                  {data?.list?.map((fixedSwaptem: any, index: number) => (
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                      <Link
                        to={routes.auction.fixedPrice
                          .replace(
                            ':chainShortName',
                            getLabelById(fixedSwaptem.chainId, 'shortName', optionDatas?.chainInfoOpt)
                          )
                          .replace(':poolId', fixedSwaptem.poolId)}
                      >
                        <AuctionCard
                          poolId={fixedSwaptem.poolId}
                          title={fixedSwaptem.name}
                          status={fixedSwaptem.status}
                          claimAt={fixedSwaptem.claimAt}
                          closeAt={fixedSwaptem.closeAt}
                          dateStr={fixedSwaptem.status == 1 ? fixedSwaptem.openAt : fixedSwaptem.closeAt}
                          holder={
                            fixedSwaptem.creatorUserInfo?.userType === UserType.Profile ? (
                              <AuctionHolder
                                href={`${routes.profile.summary}?id=${fixedSwaptem.creatorUserInfo?.userId}`}
                                avatar={fixedSwaptem.creatorUserInfo?.avatar}
                                name={fixedSwaptem.creatorUserInfo?.name}
                                description={
                                  fixedSwaptem.creatorUserInfo?.publicRole?.length > 0
                                    ? fixedSwaptem.creatorUserInfo?.publicRole?.map((item: any, index: number) => {
                                        return (
                                          getLabelById(item, 'role', optionDatas?.publicRoleOpt) +
                                          `${index !== fixedSwaptem.creatorUserInfo?.publicRole?.length - 1 && ', '}`
                                        )
                                      })
                                    : 'Individual account'
                                }
                                isVerify={fixedSwaptem.creatorUserInfo?.isVerify}
                              />
                            ) : (
                              <AuctionHolder
                                href={`${routes.company.summary}?id=${fixedSwaptem.creatorUserInfo?.userId}`}
                                avatar={fixedSwaptem.creatorUserInfo?.companyAvatar}
                                name={fixedSwaptem.creatorUserInfo?.companyName}
                                description={fixedSwaptem.creatorUserInfo?.companyIntroduction || 'No description yet'}
                                isVerify={fixedSwaptem.creatorUserInfo?.isVerify}
                              />
                            )
                          }
                          progress={{
                            symbol: fixedSwaptem.token0.symbol?.toUpperCase(),
                            decimals: fixedSwaptem.token0.decimals,
                            sold: fixedSwaptem.swappedAmount0,
                            supply: fixedSwaptem.amountTotal0
                          }}
                          listItems={
                            <>
                              <AuctionListItem
                                label="Token symbol"
                                value={
                                  <Stack direction="row" alignItems="center" spacing={4}>
                                    <TokenImage
                                      src={fixedSwaptem.token0.largeUrl}
                                      alt={fixedSwaptem.token0.symbol}
                                      size={20}
                                    />
                                    <span>{fixedSwaptem.token0.symbol.toUpperCase()}</span>
                                  </Stack>
                                }
                              />
                              <AuctionListItem
                                label="Contract address"
                                value={
                                  <Stack direction="row" alignItems="center" spacing={4}>
                                    {fixedSwaptem.token0.coingeckoId ? (
                                      <TokenImage src={CoingeckoSVG} alt="coingecko" size={20} />
                                    ) : (
                                      <Image src={ErrorSVG} width={20} height={20} alt="Dangerous" />
                                    )}
                                    <span>{shortenAddress(fixedSwaptem.token0.address)}</span>
                                    <CopyToClipboard text={fixedSwaptem.token0.address} />
                                  </Stack>
                                }
                              />
                              <AuctionListItem
                                label="Fixed price ratio"
                                value={
                                  <Stack direction="row" spacing={8}>
                                    <Typography fontSize={12}>1</Typography>
                                    <Typography fontSize={12}>
                                      {fixedSwaptem.token0.symbol.toUpperCase()} ={' '}
                                      {new BigNumber(fixedSwaptem.ratio)
                                        .decimalPlaces(6, BigNumber.ROUND_DOWN)
                                        .toFormat()}
                                    </Typography>
                                    <Typography fontSize={12}>{fixedSwaptem.token1.symbol.toUpperCase()}</Typography>
                                  </Stack>
                                }
                              />
                              <AuctionListItem
                                label="Price,$"
                                value={
                                  <span>
                                    {new BigNumber(fixedSwaptem.poolPrice)
                                      .decimalPlaces(6, BigNumber.ROUND_DOWN)
                                      .toFormat()}
                                  </span>
                                }
                              />
                            </>
                          }
                          categoryName={poolType[fixedSwaptem.category as PoolType]}
                          whiteList={fixedSwaptem.enableWhiteList ? 'Whitelist' : 'Public'}
                          chainId={fixedSwaptem.chainId}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Market
