import { Box, Grid, MenuItem, Pagination, Select, Skeleton, Stack } from '@mui/material'
import React, { useState } from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import TotalPaginationBox from '../TotalPaginationBox'
import NoData from 'bounceComponents/common/NoData'
import FormItem from 'bounceComponents/common/FormItem'
import { IIdeasListData, IIdeasListItems } from 'api/idea/type'
import { getIdeasList } from 'api/idea'
import InstitutionCard from 'bounceComponents/companies/InstitutionCard'
import { RootState } from '@/store'
import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'

export type IStartupIdeasProps = {
  userId: number
}

const defaultIdeaPageSize = 12

const StartupIdeas: React.FC<IStartupIdeasProps> = ({ userId }) => {
  const router = useRouter()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const [marketType, setMarketType] = useState<number>(0)
  const {
    pagination: ideaPagination,
    data: ideaListData,
    refresh,
    loading: ideaListLoading
  } = usePagination<IIdeasListItems<IIdeasListData>, Params>(
    async ({ current, pageSize }) => {
      const resp = await getIdeasList({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        UserId: userId,
        marketType: marketType
      })
      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      defaultPageSize: defaultIdeaPageSize,
      refreshDeps: [userId, marketType]
    }
  )
  const handlePageChange = (e, p) => {
    ideaPagination.changeCurrent(p)
  }
  return (
    <TotalPaginationBox total={ideaListData?.total} idea>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={10}>
          <FormItem name="marketCategory" label="Market Category" fieldType="custom" sx={{ width: 190 }}>
            <Select
              onChange={event => {
                if (event.target.value === 1) {
                  setMarketType(0)
                } else {
                  setMarketType(event.target.value as number)
                }
              }}
            >
              {optionDatas?.marketTypeOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.marketType}
                </MenuItem>
              ))}
            </Select>
          </FormItem>
        </Stack>
      </Stack>
      <Box sx={{ mt: 16 }}>
        {ideaListLoading ? (
          <Grid rowSpacing={24} columnSpacing={20} container>
            {Array.from(new Array(12)).map((lodingItem, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                <Box>
                  <Skeleton variant="rounded" height={322} sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid rowSpacing={24} columnSpacing={20} container>
            {ideaListData?.list?.map((ideaListItem, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                <Link target="_blank" href={`/idea/detail?id=${ideaListItem?.id}`}>
                  <InstitutionCard
                    icon={ideaListItem.avatar || DefaultAvaSVG}
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
        )}
      </Box>
      {ideaListData?.total >= defaultIdeaPageSize && (
        <Box mt={58} display={'flex'} justifyContent={'center'}>
          <Pagination
            onChange={handlePageChange}
            count={Math.ceil(ideaListData?.total / defaultIdeaPageSize) || 0}
            variant="outlined"
            siblingCount={0}
          />
        </Box>
      )}
    </TotalPaginationBox>
  )
}

export default StartupIdeas
