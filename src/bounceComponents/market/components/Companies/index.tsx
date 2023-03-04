import {
  Avatar,
  Box,
  Grid,
  ListItemButton,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { usePagination } from 'ahooks'
import moment from 'moment'
import { useRouter } from 'next/router'
import TotalPaginationBox from '../TotalPaginationBox'
import NoData from 'bounceComponents/common/NoData'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as CheckCardSVG } from 'assets/imgs/companies/checkCard.svg'
import { ReactComponent as CheckTableSVG } from 'assets/imgs/companies/checkTable.svg'
import { ReactComponent as CheckNoCardSVG } from 'assets/imgs/companies/checkNoCard.svg'
import { ReactComponent as CheckNoTableSVG } from 'assets/imgs/companies/checkNoTable.svg'
import { ReactComponent as GameSVG } from 'assets/imgs/companies/game.svg'
import ProjectCard from 'bounceComponents/companies/ProjectCard'
import { RootState } from '@/store'
import { getCompanyInformation } from 'api/market'
import InstitutionCard from 'bounceComponents/companies/InstitutionCard'
import ProjectCardSvg from 'bounceComponents/common/ProjectCardSvg'
import { getLabel } from '@/utils'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'

export type ICompaniesProps = {
  userName: string
}
const listHeart = ['Company', 'Category', 'Stage', 'Location', 'Start time']

const defaultPageSize = 12

const Companies: React.FC<ICompaniesProps> = ({ userName }) => {
  const router = useRouter()

  const [marketType, setMarketType] = useState<number>(0)
  const [checkTime, setCheckTime] = useState<number>(0)
  const [stageType, setStageType] = useState<number>(0)
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const {
    pagination,
    data: topCompaniesData,
    refresh,
    loading: topCompaniesLoading
  } = usePagination(
    async ({ current, pageSize }) => {
      const resp = await getCompanyInformation({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        name: userName,
        startup: checkTime === 0 ? 0 : moment().subtract(checkTime, 'year').unix(),
        companyStage: stageType,
        marketCategory: marketType
      })
      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      defaultPageSize: defaultPageSize,
      refreshDeps: [userName, checkTime, marketType, stageType]
    }
  )
  const handlePageChange = (e, p) => {
    pagination.changeCurrent(p)
  }

  const [checkCard, setCheckCard] = useState<boolean>(true)
  return (
    <TotalPaginationBox total={topCompaniesData?.total}>
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
              defaultValue={1}
            >
              {optionDatas?.marketTypeOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.marketType}
                </MenuItem>
              ))}
            </Select>
          </FormItem>
          <FormItem name="companyStage" label="Company stage" sx={{ width: 190 }}>
            <Select
              onChange={event => {
                setStageType(event.target.value as number)
              }}
              defaultValue={0}
            >
              <MenuItem value={0}>All States</MenuItem>
              {optionDatas?.companyStateOpt?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.state}
                </MenuItem>
              ))}
            </Select>
          </FormItem>
          <FormItem name="startTime" label="Start time" sx={{ width: 190 }}>
            <Select
              onChange={event => {
                setCheckTime(event.target.value as number)
              }}
              defaultValue={0}
            >
              <MenuItem value={0}>All Years</MenuItem>
              <MenuItem value={1}>{`< 1 Year`}</MenuItem>
              <MenuItem value={2}>2 Years</MenuItem>
              <MenuItem value={3}>3 Years</MenuItem>
              <MenuItem value={4}>4 Years</MenuItem>
              <MenuItem value={5}>{`>= 5 Years`}</MenuItem>
            </Select>
          </FormItem>
        </Stack>
        <Stack direction={'row'} spacing={16}>
          {checkCard ? (
            <CheckCardSVG />
          ) : (
            <CheckNoCardSVG
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setCheckCard(true)
              }}
            />
          )}
          {checkCard ? (
            <CheckNoTableSVG
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setCheckCard(false)
              }}
            />
          ) : (
            <CheckTableSVG />
          )}
        </Stack>
      </Stack>
      <Box sx={{ mt: 16 }}>
        {checkCard ? (
          topCompaniesLoading ? (
            <Grid rowSpacing={24} columnSpacing={20} container>
              {Array.from(new Array(8)).map((lodingItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                  <Box>
                    <Skeleton variant="rounded" height={322} sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid rowSpacing={24} columnSpacing={20} container>
              {topCompaniesData?.list?.map((ideaListItem, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                  <Box
                    onClick={() => {
                      router.push(
                        `/company/summary?${
                          ideaListItem?.thirdpartId !== 0
                            ? `thirdpartId=${ideaListItem?.thirdpartId}`
                            : `id=${ideaListItem?.companyId}`
                        }`
                      )
                    }}
                  >
                    <InstitutionCard
                      icon={ideaListItem.avatar || CompanyDefaultSVG}
                      status={ideaListItem.marketType}
                      title={ideaListItem.name}
                      isVerify={ideaListItem.isVerify}
                      desc={ideaListItem.bio}
                      likeAmount={{
                        dislikeCount: ideaListItem.dislikeCount,
                        likeCount: ideaListItem.likeCount,
                        myDislike: ideaListItem.myDislike,
                        myLike: ideaListItem.myLike
                      }}
                      acitve={ideaListItem.active}
                      objId={ideaListItem.id}
                      startup={ideaListItem.startup}
                      refresh={refresh}
                      commentCount={ideaListItem.commentCount}
                      companyState={ideaListItem.companyState}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )
        ) : (
          <TableContainer component={Box}>
            <Table sx={{ '& .MuiTableCell-root': { border: 0 } }}>
              <TableHead>
                <TableRow sx={{ background: 'var(--ps-gray-50)' }}>
                  {listHeart.map((item, index) => (
                    <TableCell
                      key={index}
                      align={index === 4 ? 'right' : 'left'}
                      sx={{ borderRadius: index === 0 ? '20px 0 0 20px' : index === 4 ? '0 20px 20px 0' : '0px' }}
                    >
                      <Typography variant="h6" color={'var(--ps-gray-700)'} textTransform={'uppercase'}>
                        {item}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <Box height={12} />
                {topCompaniesLoading
                  ? Array.from(new Array(12)).map((lodingItem, index) => (
                      <TableRow key={index} sx={{ borderRadius: 20 }}>
                        {Array.from(new Array(5)).map((item, index) => (
                          <TableCell key={index}>
                            <Skeleton
                              variant="rounded"
                              height={48}
                              sx={{ borderRadius: 20, bgcolor: 'var(--ps-gray-30)' }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : topCompaniesData?.list.map((row, index) => (
                      <TableRow key={index} component={ListItemButton} sx={{ borderRadius: 20 }}>
                        <TableCell
                          sx={{ borderRadius: '20px 0 0 20px' }}
                          onClick={() => {
                            router.push(
                              `/company/summary?${
                                row?.thirdpartId !== 0 ? `thirdpartId=${row?.thirdpartId}` : `id=${row?.companyId}`
                              }`
                            )
                          }}
                        >
                          <Stack direction={'row'} spacing={12} alignItems={'center'}>
                            <Avatar sx={{ width: 32, height: 32 }} src={row.avatar || CompanyDefaultSVG} />
                            <Typography variant="h5">{row.name}</Typography>
                            <VerifiedIcon isVerify={row.isVerify} />
                          </Stack>
                        </TableCell>
                        <TableCell>{row.marketType === 0 ? '-' : <ProjectCardSvg status={row.marketType} />}</TableCell>
                        <TableCell>
                          <Box
                            px={8}
                            sx={{
                              height: 24,
                              borderRadius: 20,
                              background: !!row.companyState && 'var(--ps-gray-50)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              flexDirection: 'row'
                            }}
                          >
                            <Typography variant="body2" margin={'0 auto'}>
                              <Typography variant="body2">
                                {row.companyState === 0
                                  ? '-'
                                  : getLabel(row.companyState, 'state', optionDatas?.companyStateOpt)}
                              </Typography>
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.location || '-'}</TableCell>
                        <TableCell align="right" sx={{ borderRadius: '0 20px 20px 0' }}>
                          {!row.startup ? '-' : moment(row.startup * 1000).format('MMM YYYY')}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {topCompaniesData?.total > defaultPageSize && (
          <Box display={'flex'} justifyContent={'center'}>
            <Pagination
              sx={{ mt: 40 }}
              onChange={handlePageChange}
              count={Math.ceil(topCompaniesData?.total / defaultPageSize || 0)}
              variant="outlined"
              siblingCount={0}
            />
          </Box>
        )}
      </Box>
    </TotalPaginationBox>
  )
}

export default Companies
