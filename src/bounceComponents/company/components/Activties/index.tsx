import { Button, Grid, MenuItem, Select, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useRouter } from 'next/router'
import { useRequest } from 'ahooks'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import Link from 'next/link'
import { ReactComponent as NoPoolFoundSVG } from '@/assets/imgs/noPoolFound.svg'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import CoingeckoSVG from '@/assets/imgs/chains/coingecko.svg'
import AuctionCard, { AuctionHolder, AuctionListItem } from '@/components/common/AuctionCard'
import FormItem from '@/components/common/FormItem'
import { getActivitiesTotal, getUserPoolsFixedSwap } from '@/api/profile'
import { RootState } from '@/store'
import { usePersonalInfo } from '@/hooks/user/usePersonalInfo'
import TokenImage from '@/components/common/TokenImage'
import { shortenAddress } from '@/utils/web3/address'
import { PoolType } from '@/api/pool/type'
import { getLabel } from '@/utils'
import { formatNumber } from '@/utils/web3/number'
import NoData from '@/components/common/NoData'
import { getIdeasList } from '@/api/idea'
import InstitutionCard from '@/components/companies/InstitutionCard'
import { UserType } from '@/api/market/type'
import ErrorSVG from '@/assets/imgs/icon/error_filled.svg'

export type IActivtiesProps = { type }
const poolType: Record<PoolType, string> = {
  [PoolType.FixedSwap]: 'Fixed-Price',
  [PoolType.Lottery]: 'Lottery',
  [PoolType.Duch]: 'Dutch Auction',
  [PoolType.SealedBid]: 'SealedBid',
}
const Activties: React.FC<IActivtiesProps> = ({ type }) => {
  const router = useRouter()
  const { thirdpartId } = router.query
  const { token } = useSelector((state: RootState) => state.user)
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const [btnSta, setBtnSta] = useState<string>('Auction')
  const [poolBtnSta, setPoolBtnSta] = useState<string>('Fixed')
  const [chain, setChain] = useState<number>(1)
  const handleCreateBtnClick = () => {
    if (!token) {
      toast.error('Please login')
      router.push(`/login?path=/auction/create-auction-pool?redirect=/company/activities`)
    } else {
      router.push('/auction/create-auction-pool?redirect=/company/activities')
    }
  }
  const { personalId, isMe } = usePersonalInfo(type)

  const { data: activitiesTotalData } = useRequest(
    async () => {
      const resp = await getActivitiesTotal({
        chainId: chain,
        userId: personalId,
      })
      return {
        auctionTotal: resp.data.auctionTotal,
        ideaTotal: resp.data.ideaTotal,
        nftTotal: resp.data.nftTotal,
      }
    },
    {
      // onSuccess: (resp) => {
      //   if (resp?.auctionTotal >= resp?.ideaTotal || (resp?.auctionTotal === 0 && resp?.ideaTotal === 0)) {
      //     setBtnSta('Auction')
      //   } else {
      //     setBtnSta('Ideas')
      //   }
      // },
      ready: !!personalId && !thirdpartId,
      refreshDeps: [chain, personalId, thirdpartId],
    },
  )
  const { data: ideaListData, refresh } = useRequest(
    async () => {
      const resp = await getIdeasList({
        offset: 0,
        limit: 1000,
        UserId: personalId,
      })
      return {
        total: resp.data.total,
        list: resp.data.list,
      }
    },
    {
      ready: !thirdpartId && !!personalId,
      refreshDeps: [personalId, thirdpartId],
    },
  )
  const { data: fixedSwapData } = useRequest(
    async () => {
      const resp = await getUserPoolsFixedSwap({
        chainId: chain,
        userId: personalId,
      })
      return {
        total: resp.data.total,
        list: resp.data.list,
        createdTotal: resp.data.createdTotal,
        participatedTotal: resp.data.participatedTotal,
      }
    },
    {
      ready: !!personalId,
      refreshDeps: [chain, personalId, thirdpartId],
    },
  )

  return (
    <Box mt={40}>
      <Box display={'flex'} justifyContent={'space-between'} p={'0px 48px 38px'}>
        <Stack direction={'row'} spacing={10}>
          <Button
            variant={btnSta === 'Auction' ? 'contained' : 'outlined'}
            onClick={() => {
              setBtnSta('Auction')
            }}
          >
            Auction Pools ({activitiesTotalData?.auctionTotal || 0})
          </Button>
          <Button
            variant={btnSta === 'Ideas' ? 'contained' : 'outlined'}
            onClick={() => {
              setBtnSta('Ideas')
            }}
          >
            Startup Ideas ({activitiesTotalData?.ideaTotal || 0})
          </Button>
        </Stack>
        {btnSta === 'Auction' ? (
          <Stack direction={'row'} spacing={10}>
            <FormItem name="age" required sx={{ width: 190, height: 60 }}>
              <Select
                sx={{ borderRadius: 20 }}
                defaultValue={chain}
                onChange={(e) => {
                  setChain(e.target.value as number)
                }}
              >
                {optionDatas?.chainInfoOpt?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.chainName.split(' ')[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormItem>
            {isMe && (
              <Button
                variant="contained"
                sx={{ width: 156 }}
                endIcon={<AddCircleOutlineIcon />}
                onClick={handleCreateBtnClick}
              >
                Create pool
              </Button>
            )}
          </Stack>
        ) : (
          isMe && (
            <Button
              variant="contained"
              sx={{ width: 156 }}
              endIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                if (!token) {
                  toast.error('Please login')
                  router.push('/login?path=/idea/create')
                } else {
                  router.push('/idea/create')
                }
              }}
            >
              Propose idea
            </Button>
          )
        )}
      </Box>
      {btnSta === 'Auction' ? (
        <Box sx={{ background: 'var(--ps-gray-50)', mx: 12, p: '42px 36px', borderRadius: 20 }}>
          <Typography variant="h2" fontSize={24} mb={30}>
            Auction Pools
          </Typography>

          {poolBtnSta === 'Fixed' && fixedSwapData?.createdTotal > 0 ? (
            <Grid container spacing={18}>
              {fixedSwapData?.list?.map((fixedSwaptem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={index}>
                  <Box
                    component={'a'}
                    target="_blank"
                    href={`/auction/fixed-price/${getLabel(chain, 'shortName', optionDatas?.chainInfoOpt)}/${Number(
                      fixedSwaptem.poolId,
                    )}`}
                  >
                    <AuctionCard
                      poolId={fixedSwaptem.poolId}
                      title={fixedSwaptem.name}
                      status={fixedSwaptem.status}
                      isMe={isMe}
                      isCreator={true}
                      creatorClaimed={fixedSwaptem.creatorClaimed}
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
                                ? fixedSwaptem.creatorUserInfo?.publicRole?.map((item, index) => {
                                    return (
                                      getLabel(item, 'role', optionDatas?.publicRoleOpt) +
                                      `${index !== fixedSwaptem.creatorUserInfo?.publicRole?.length - 1 && ', '}`
                                    )
                                  })
                                : 'Individual account'
                            }
                            isVerify={fixedSwaptem.creatorUserInfo?.isVerify}
                          />
                        ) : (
                          <AuctionHolder
                            href={`/company/summary?id=${fixedSwaptem.creatorUserInfo?.userId}`}
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
                        supply: fixedSwaptem.amountTotal0,
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
                                  <TokenImage src={ErrorSVG} alt="coingecko" size={20} />
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
                                  {new BigNumber(fixedSwaptem.ratio).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
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
                          />{' '}
                        </>
                      }
                      categoryName={poolType[fixedSwaptem.category]}
                      whiteList={fixedSwaptem.enableWhiteList ? 'Whitelist' : 'Public'}
                      chainId={fixedSwaptem.chainId}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box width={300} pt={33} pb={70} textAlign={'center'} margin={'0 auto'}>
              <NoPoolFoundSVG />
              <Typography mt={20} variant="body1" fontSize={20} color={'#908E96'}>
                No pool found
              </Typography>
            </Box>
          )}
        </Box>
      ) : btnSta === 'Ideas' ? (
        <Box sx={{ background: 'var(--ps-gray-50)', mx: 12, p: '42px 36px', borderRadius: 20 }}>
          <Typography variant="h2" fontSize={24}>
            Startup Ideas
          </Typography>
          {ideaListData?.total > 0 ? (
            <Grid container spacing={18} mt={12}>
              {ideaListData?.list?.map((ideaListItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                  <Link target="_blank" href={`/idea/detail?id=${ideaListItem?.id}`}>
                    <InstitutionCard
                      icon={ideaListItem.avatar}
                      status={ideaListItem.marketType}
                      title={ideaListItem.FullName}
                      ideaTitle={ideaListItem.title}
                      isVerify={ideaListItem.isVerify}
                      isEdit={isMe}
                      desc={ideaListItem.summary}
                      likeAmount={{
                        dislikeCount: ideaListItem.dislikeCount,
                        likeCount: ideaListItem.likeCount,
                        myDislike: ideaListItem.myDislike,
                        myLike: ideaListItem.myLike,
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
            <Box width={300} pt={33} pb={70} textAlign={'center'} margin={'0 auto'}>
              <NoPoolFoundSVG />
              <Typography mt={20} variant="body1" fontSize={20} color={'#908E96'}>
                No idea found
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default Activties
