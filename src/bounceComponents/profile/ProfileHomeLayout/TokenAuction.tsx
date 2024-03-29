import { Box, Grid, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { IAuctionPoolsItems } from 'api/profile/type'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { useOptionDatas } from 'state/configOptions/hooks'
import { IProfileUserInfo } from 'api/user/type'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import { getPools } from 'api/market'
import AuctionCardFull from 'bounceComponents/common/AuctionCard/AuctionCardFull'
import { NFTCard } from 'pages/market/nftAuctionPool/index'
import { getLabelById } from 'utils'
import { routes } from 'constants/routes'
import AuctionTypeSelect from 'bounceComponents/common/AuctionTypeSelect'
import { BackedTokenType } from '../../../pages/account/MyTokenOrNFT'
import EmptyData from 'bounceComponents/common/EmptyData'

export type IActivitieProps = {
  userInfo: IProfileUserInfo
  tokenType: BackedTokenType
}
const defaultPageSize = 9

const TokenAuction: React.FC<IActivitieProps> = ({ userInfo, tokenType }) => {
  const optionDatas = useOptionDatas()
  const [curChain, setCurChain] = useState(0)
  const [curPoolType, setCurPoolType] = useState<PoolType | 0>(0)

  const {
    pagination,
    data: auctionPoolData,
    loading
  } = usePagination<IAuctionPoolsItems<FixedSwapPool>, Params>(
    async ({ current, pageSize }) => {
      const category = curPoolType
      // tokenType erc20:1 , erc1155:2
      const resp = await getPools({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        CreatorUserId: userInfo.id,
        category,
        chainId: curChain,
        orderBy: '',
        tokenType
      })
      if (tokenType === BackedTokenType.TOKEN) {
        return {
          list: resp.data.fixedSwapList.list,
          total: resp.data.fixedSwapList.total
        }
      }

      return {
        list: resp.data.fixedSwapNftList.list,
        total: resp.data.fixedSwapNftList.total
      }
    },
    {
      defaultPageSize,
      refreshDeps: [userInfo.id, curChain, curPoolType, tokenType]
    }
  )

  const handlePageChange = useCallback((_: any, p: number) => pagination.changeCurrent(p), [pagination])

  return (
    <Box mx={12} mb={48} p={'40px 30px 48px 36px'}>
      <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
        <Typography fontFamily={'"Sharp Grotesk DB Cyr Medium 22"'} fontSize={24}>
          {tokenType === BackedTokenType.TOKEN ? 'Token' : 'NFT'} Auction
        </Typography>
        <Stack direction={'row'} spacing={15}>
          <Select
            value={curChain}
            onChange={e => setCurChain(Number(e.target?.value) || 0)}
            sx={{
              width: '200px',
              height: '38px'
            }}
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
          <AuctionTypeSelect tokenType={tokenType} curPoolType={curPoolType} setCurPoolType={t => setCurPoolType(t)} />
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BounceAnime />
        </Box>
      ) : !auctionPoolData?.total || auctionPoolData?.total === 0 ? (
        <EmptyData
          title={`${userInfo.fullName} hasn’t created Auction`}
          prompt="Once they do, those Auctions will show up here."
        />
      ) : (
        <Box mt={20}>
          {auctionPoolData && auctionPoolData?.total > 0 && (
            <Grid container spacing={18}>
              {auctionPoolData?.list?.map((auctionPoolItem, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                  {auctionPoolItem.category !== PoolType.fixedSwapNft ? (
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

export default TokenAuction
