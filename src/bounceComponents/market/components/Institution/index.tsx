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
  Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import moment from 'moment'
import { usePagination } from 'ahooks'
import { useRouter } from 'next/router'
import TotalPaginationBox from '../TotalPaginationBox'
import NoData from '@/components/common/NoData'
import FormItem from '@/components/common/FormItem'
import { ReactComponent as CheckCardSVG } from '@/assets/imgs/companies/checkCard.svg'
import { ReactComponent as CheckTableSVG } from '@/assets/imgs/companies/checkTable.svg'
import { ReactComponent as CheckNoCardSVG } from '@/assets/imgs/companies/checkNoCard.svg'
import { ReactComponent as CheckNoTableSVG } from '@/assets/imgs/companies/checkNoTable.svg'
import { ReactComponent as GameSVG } from '@/assets/imgs/companies/game.svg'
import InstitutionCard from '@/components/companies/InstitutionCard'
import { getInstitutionInvestors } from '@/api/market'
import CompanyDefaultSVG from '@/assets/imgs/defaultAvatar/company.svg'
import VerifiedIcon from '@/components/common/VerifiedIcon'

export type IInstitutionProps = {
  userName: string
}
const listHeart = ['Institution Investor', 'Location', 'Start time']

const defaultPageSize = 12
const Institution: React.FC<IInstitutionProps> = ({ userName }) => {
  const router = useRouter()
  const [checkTime, setCheckTime] = useState<number>(0)
  const {
    pagination,
    data: institutionInvestorsData,
    loading: institutionInvestorsLoading,
  } = usePagination(
    async ({ current, pageSize }) => {
      const resp = await getInstitutionInvestors({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        name: userName,
        startup: checkTime === 0 ? 0 : moment().subtract(checkTime, 'year').unix(),
      })
      return {
        total: resp.data.total,
        list: resp.data.list,
      }
    },
    {
      defaultPageSize: defaultPageSize,
      refreshDeps: [userName, checkTime],
    },
  )
  const handlePageChange = (e, p) => {
    pagination.changeCurrent(p)
  }
  const [checkCard, setCheckCard] = useState<boolean>(true)
  return (
    <TotalPaginationBox total={institutionInvestorsData?.total}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <FormItem name="startTime" label="Start time" sx={{ width: 190 }}>
          <Select
            onChange={(event) => {
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
          institutionInvestorsLoading ? (
            <Grid rowSpacing={24} columnSpacing={20} container>
              {Array.from(new Array(12)).map((lodingItem, index) => (
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={index}>
                  <Box>
                    <Skeleton variant="rounded" height={282} sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid rowSpacing={24} columnSpacing={20} container>
              {institutionInvestorsData?.list.map((item, i) => (
                <Grid key={i} item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <Box
                    onClick={() => {
                      router.push(
                        `/company/summary?${
                          item?.thirdpartId !== 0 ? `thirdpartId=${item?.thirdpartId}` : `id=${item?.companyId}`
                        }`,
                      )
                    }}
                  >
                    <InstitutionCard
                      startup={item.startup}
                      title={item.name}
                      isVerify={item.isVerify}
                      acitve={item.active}
                      icon={item.avatar || CompanyDefaultSVG}
                      desc={item.bio}
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
                  {listHeart.map((item, index) => [
                    <TableCell
                      key={index}
                      align={index === 2 ? 'right' : 'left'}
                      sx={{ borderRadius: index === 0 ? '20px 0 0 20px' : index === 2 ? '0 20px 20px 0' : '0px' }}
                    >
                      <Typography variant="h6" color={'var(--ps-gray-700)'} textTransform={'uppercase'}>
                        {item}
                      </Typography>
                    </TableCell>,
                  ])}
                </TableRow>
              </TableHead>
              <TableBody>
                <Box height={12} />
                {institutionInvestorsLoading
                  ? Array.from(new Array(12)).map((lodingItem, index) => (
                      <TableRow key={index} sx={{ borderRadius: 20 }}>
                        {Array.from(new Array(3)).map((item, index) => (
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
                  : institutionInvestorsData?.list.map((row, index) => (
                      <TableRow key={index} component={ListItemButton} sx={{ borderRadius: 20 }}>
                        <TableCell
                          sx={{ borderRadius: '20px 0 0 20px' }}
                          onClick={() => {
                            router.push(
                              `/company/summary?${
                                row?.thirdpartId !== 0 ? `thirdpartId=${row?.thirdpartId}` : `id=${row?.companyId}`
                              }`,
                            )
                          }}
                        >
                          <Stack direction={'row'} spacing={12} alignItems={'center'}>
                            <Avatar sx={{ width: 32, height: 32 }} src={row.avatar || CompanyDefaultSVG} />
                            <Typography variant="h5">{row.name}</Typography>
                            <VerifiedIcon isVerify={row?.isVerify} />
                          </Stack>
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
      </Box>
      {institutionInvestorsData?.total > defaultPageSize && (
        <Box display={'flex'} justifyContent={'center'}>
          <Pagination
            sx={{ mt: 40 }}
            onChange={handlePageChange}
            count={Math.ceil(institutionInvestorsData?.total / defaultPageSize || 0)}
            variant="outlined"
            siblingCount={0}
          />
        </Box>
      )}
    </TotalPaginationBox>
  )
}

export default Institution
