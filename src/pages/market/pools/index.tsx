import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { show } from '@ebay/nice-modal-react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import Image from 'components/Image'
// import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import BigNumber from 'bignumber.js'
import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import { ReactComponent as SearchSVG } from 'assets/imgs/companies/search.svg'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
import AuctionCard, { AuctionHolder, AuctionListItem } from 'bounceComponents/common/AuctionCard'
import FormItem from 'bounceComponents/common/FormItem'
import TokenImage from 'bounceComponents/common/TokenImage'
import { PoolType } from 'api/pool/type'
import { getLabel, shortenAddress } from 'utils'
// import { formatNumber } from '@/utils/web3/number'
import NoData from 'bounceComponents/common/NoData'
import { Token } from 'bounceComponents/create-auction-pool/types'
import TokenDialog from 'bounceComponents/create-auction-pool/TokenDialog'
import { getPools } from 'api/market'
import TotalPaginationBox from 'bounceComponents/market/components/TotalPaginationBox'
import FakeOutlinedInput from 'bounceComponents/create-auction-pool/FakeOutlinedInput'
import { UserType } from 'api/market/type'
import { useOptionDatas } from 'state/configOptions/hooks'
import { routes } from 'constants/routes'
// import { ReactComponent as CloseSVG } from 'assets/imgs/auction/close.svg'
// export type IPoolsProps = {}

const poolType: Record<PoolType, string> = {
  [PoolType.FixedSwap]: 'Fixed-Price',
  [PoolType.Lottery]: 'Lottery',
  [PoolType.Duch]: 'Dutch Auction',
  [PoolType.SealedBid]: 'SealedBid'
}
const initialValues = {
  searchText: '',
  searchType: 0,
  sortBy: 0,
  tokenFromAddress: '',
  tokenFromSymbol: '',
  tokenFromLogoURI: '',
  tokenFromDecimals: '',
  poolStatus: 0,
  auctionType: 1,
  chain: 1
}
const defaultIdeaPageSize = 12
const searchOptions = ['Pool Name', 'Pool ID', 'Creator Name', 'Creator Address']

export interface IFormObserverProps {
  handleSubmit: any
}
const FormObserver: React.FC<IFormObserverProps> = ({ handleSubmit }) => {
  const { values }: any = useFormikContext()
  const refPoolStatus = useRef(0)
  const refTokenFromAddress = useRef('')
  const refAuctionType = useRef(1)
  const refChain = useRef(3)
  const refSortBy = useRef(0)
  useEffect(() => {
    if (values.poolStatus !== refPoolStatus.current) {
      refPoolStatus.current = values.poolStatus
      handleSubmit(values)
    } else if (values.tokenFromAddress !== refTokenFromAddress.current) {
      refTokenFromAddress.current = values.tokenFromAddress
      handleSubmit(values)
    } else if (values.auctionType !== refAuctionType.current) {
      refAuctionType.current = values.auctionType
      handleSubmit(values)
    } else if (values.chain !== refChain.current) {
      refChain.current = values.chain
      handleSubmit(values)
    } else if (values.sortBy !== refSortBy.current) {
      refSortBy.current = values.sortBy
      handleSubmit(values)
    } else {
      return
    }
  }, [handleSubmit, values])
  return null
}

const Pools: React.FC = ({}) => {
  const optionDatas = useOptionDatas()
  const [chain, setChain] = useState<number>(3)
  const showTokenDialog = (setFieldValue: (field: string, value: any) => void) => {
    show<Token>(TokenDialog, { chainId: getLabel(chain, 'ethChainId', optionDatas?.chainInfoOpt) })
      .then(res => {
        setFieldValue('tokenFromAddress', res.address)
        setFieldValue('tokenFromSymbol', res.symbol)
        setFieldValue('tokenFromLogoURI', res.logoURI)
        setFieldValue('tokenFromDecimals', res.decimals)
      })
      .catch(err => {
        console.log('TokenDialog Rejected: ', err)
      })
  }

  const {
    pagination: poolsPagination,
    data: poolsData,
    run,
    params
  } = usePagination<any, Params>(
    async ({
      current,
      pageSize,
      category,
      chainId,
      creatorAddress,
      creatorName,
      orderBy,
      poolId,
      poolName,
      poolStatusFrontend,
      token0Address
    }) => {
      if (!chainId) {
        return Promise.reject(new Error('No ChainId'))
      }

      const resp = await getPools({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        category: category,
        chainId: chainId,
        creatorAddress: creatorAddress,
        creatorName: creatorName,
        orderBy: orderBy === 0 ? 'openTs' : 'createTs',
        poolId: poolId,
        poolName: poolName,
        poolStatusFrontend: poolStatusFrontend === 0 ? null : poolStatusFrontend,
        token0Address: token0Address
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
      manual: true,
      defaultPageSize: defaultIdeaPageSize
    }
  )

  const handleSubmit = (values: typeof initialValues) => {
    setChain(values.chain)
    run({
      current: 1,
      pageSize: 12,
      category: values.auctionType,
      chainId: values.chain,
      creatorAddress: values.searchType === 3 ? values.searchText : '',
      creatorName: values.searchType === 2 ? values.searchText : '',
      orderBy: values.sortBy,
      poolId: values.searchType === 1 ? values.searchText : '',
      poolName: values.searchType === 0 ? values.searchText : '',
      poolStatusFrontend: values.poolStatus,
      token0Address: values.tokenFromAddress
    })
  }

  const handlePageChange = (_: any, p: number) => {
    poolsPagination.changeCurrent(p)
  }
  return (
    <section>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <Box>
              <Box sx={{ height: 358, background: 'var(--ps-gray-900)' }} />
              <Box sx={{ position: 'relative', mt: -358 }}>
                <FormObserver handleSubmit={handleSubmit} />
                <Container maxWidth="lg">
                  <Stack spacing={32} pt={60} pb={48} component={Form}>
                    <Typography variant="h1" sx={{ color: 'var(--ps-white)', textAlign: 'left' }}>
                      Auction Pools
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                      <FormItem name="searchType" label="searchType" sx={{ width: 320 }}>
                        <Select defaultValue={0}>
                          {searchOptions.map((opt, index) => [
                            <MenuItem value={index} key={index}>
                              {opt}
                            </MenuItem>
                          ])}
                        </Select>
                      </FormItem>
                      <FormItem name="searchText" sx={{ width: 648, ml: 8 }}>
                        <OutlinedInput
                          placeholder={`Search by ${searchOptions[values.searchType]?.toLocaleLowerCase()}`}
                          startAdornment={
                            <InputAdornment position="start">
                              <SearchSVG />
                            </InputAdornment>
                          }
                        />
                      </FormItem>
                      <Button
                        type="submit"
                        sx={{
                          width: 204,
                          ml: 20,
                          '&.MuiButton-textPrimary': {
                            background: 'var(--ps-blue)',
                            color: 'var(--ps-white)',
                            '&:hover': {
                              background: 'var(--ps-blue-50)'
                            },
                            '&:active': {
                              background: 'var(--ps-blue-100)'
                            }
                          }
                        }}
                      >
                        Search
                      </Button>
                    </Box>
                  </Stack>
                </Container>
                <Container maxWidth="lg" sx={{ position: 'relative' }}>
                  <TotalPaginationBox total={poolsData?.total || 0} create={true}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={10}>
                        <FormItem name="chain" label="Chain" sx={{ width: 190 }}>
                          <Select defaultValue={1}>
                            {optionDatas?.chainInfoOpt?.map((item, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.chainName.split(' ')[0]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormItem>
                        {values?.tokenFromAddress ? (
                          <FormItem
                            name="tokenFromSymbol"
                            label="token"
                            startAdornment={
                              <Avatar
                                alt={values?.tokenFromSymbol}
                                src={values?.tokenFromLogoURI}
                                sx={{ width: 32, height: 32 }}
                              />
                            }
                          >
                            <FakeOutlinedInput
                              disabled
                              sx={{ maxWidth: 200 }}
                              endAdornment={
                                <IconButton
                                  onClick={e => {
                                    e.stopPropagation()
                                    setFieldValue('tokenFromAddress', '')
                                    setFieldValue('tokenFromSymbol', '')
                                    run({
                                      ...params,
                                      tokenFromAddress: '',
                                      current: 1,
                                      pageSize: 12
                                    })
                                  }}
                                >
                                  <HighlightOffIcon />
                                </IconButton>
                              }
                              onClick={() => {
                                showTokenDialog(setFieldValue)
                              }}
                            />
                          </FormItem>
                        ) : (
                          <FormItem name="tokenFromSymbol" label="Select a token">
                            <FakeOutlinedInput
                              disabled
                              onClick={() => {
                                showTokenDialog(setFieldValue)
                              }}
                            />
                          </FormItem>
                        )}
                        <FormItem name="poolStatus" label="Pool Status" sx={{ width: 190 }}>
                          <Select>
                            <MenuItem value={0}>All Status</MenuItem>
                            <MenuItem value={'live'}>Live</MenuItem>
                            <MenuItem value={'upcoming'}>Upcoming</MenuItem>
                            <MenuItem value={'finished'}>Closed</MenuItem>
                          </Select>
                        </FormItem>
                        <FormItem name="auctionType" label="Auction type" sx={{ width: 190 }}>
                          <Select defaultValue={1}>
                            <MenuItem value={1}>Fixed Price</MenuItem>
                          </Select>
                        </FormItem>
                      </Stack>
                      <FormItem name="sortBy" label="Sort by" sx={{ width: 190 }}>
                        <Select>
                          <MenuItem value={0}>Start time</MenuItem>
                          <MenuItem value={1}>Creation time</MenuItem>
                        </Select>
                      </FormItem>
                    </Stack>
                    <Box mt={16}>
                      {poolsData?.total > 0 ? (
                        <Grid container spacing={18}>
                          {poolsData?.list?.map((fixedSwaptem: any, index: number) => (
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                              <Box
                                component={'a'}
                                target="_blank"
                                href={routes.auction.fixedPrice
                                  .replace(':chainShortName', getLabel(chain, 'shortName', optionDatas?.chainInfoOpt))
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
                                        href={`/profile/summary?id=${fixedSwaptem.creatorUserInfo?.userId}`}
                                        avatar={fixedSwaptem.creatorUserInfo?.avatar}
                                        name={fixedSwaptem.creatorUserInfo?.name}
                                        description={
                                          fixedSwaptem.creatorUserInfo?.publicRole?.length > 0
                                            ? fixedSwaptem.creatorUserInfo?.publicRole?.map(
                                                (item: any, index: number) => {
                                                  return (
                                                    getLabel(item, 'role', optionDatas?.publicRoleOpt) +
                                                    `${
                                                      index !== fixedSwaptem.creatorUserInfo?.publicRole?.length - 1 &&
                                                      ', '
                                                    }`
                                                  )
                                                }
                                              )
                                            : 'Individual account'
                                        }
                                        isVerify={fixedSwaptem.creatorUserInfo?.isVerify}
                                      />
                                    ) : (
                                      <AuctionHolder
                                        href={`/company/summary?id=${fixedSwaptem.creatorUserInfo?.userId}`}
                                        avatar={fixedSwaptem.creatorUserInfo?.companyAvatar}
                                        name={fixedSwaptem.creatorUserInfo?.companyName}
                                        description={
                                          fixedSwaptem.creatorUserInfo?.companyIntroduction || 'No description yet'
                                        }
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
                                            <Typography fontSize={12}>
                                              {fixedSwaptem.token1.symbol.toUpperCase()}
                                            </Typography>
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
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <NoData />
                      )}

                      {poolsData?.total >= defaultIdeaPageSize && (
                        <Box mt={58} display={'flex'} justifyContent={'center'}>
                          <Pagination
                            onChange={handlePageChange}
                            count={Math.ceil(poolsData?.total / defaultIdeaPageSize) || 0}
                            variant="outlined"
                            siblingCount={0}
                          />
                        </Box>
                      )}
                    </Box>
                  </TotalPaginationBox>
                </Container>
              </Box>
            </Box>
          )
        }}
      </Formik>
    </section>
  )
}

export default Pools
