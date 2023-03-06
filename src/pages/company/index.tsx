import { Button, Container, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp'
import React from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { toast } from 'react-toastify'
import styles from './styles'
import InstitutionCard from 'bounceComponents/companies/InstitutionCard'
import { IIdeasListData, IIdeasListItems } from 'api/idea/type'
import { getIdeasList } from 'api/idea'
import { getCompanyInformation, getInstitutionInvestors } from 'api/market'
import CompanyBanner from 'bounceComponents/company/CompanyBanner'
import CompanyBanner1 from 'assets/imgs/company/banner/company.png'
import CompanyBanner2 from 'assets/imgs/company/banner/banner4.png'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useUserInfo } from 'state/users/hooks'

const defaultIdeaPageSize = 8

const Company: React.FC = ({}) => {
  const navigate = useNavigate()
  const {
    data: ideaListData,
    refresh,
    loading: ideaLoding
  } = usePagination<IIdeasListItems<IIdeasListData>, Params>(
    async ({ current, pageSize }) => {
      const resp = await getIdeasList({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        UserId: 0,
        marketType: 0
      })
      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      defaultPageSize: defaultIdeaPageSize
    }
  )

  const {
    loading: topCompaniesLoding,
    data: topCompaniesData,
    refresh: companyInformationRefresh
  } = usePagination(
    async ({ current, pageSize }) => {
      const resp = await getCompanyInformation({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        name: '',
        startup: 0,
        companyStage: 0,
        marketCategory: 0
      })
      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      defaultPageSize: defaultIdeaPageSize
    }
  )
  const { loading: InstitutionInvestorsLoding, data: institutionInvestorsData } = usePagination(
    async ({ current, pageSize }) => {
      const resp = await getInstitutionInvestors({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        name: '',
        startup: 0
      })
      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      defaultPageSize: defaultIdeaPageSize
    }
  )
  const { token } = useUserInfo()
  const bannerList = [
    {
      img: CompanyBanner1,
      title: 'Everything about  companies and investors in one place'
    },
    {
      img: CompanyBanner2,
      title: 'Write up your startup idea and get supporters'
    }
  ]
  return (
    <>
      <Container maxWidth="lg">
        <Box mt={60}>
          <CompanyBanner list={bannerList} />
        </Box>
        <Box sx={styles.rootPaper}>
          <Box sx={styles.ideasBox}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h2" fontSize={24}>
                Trending Startup Ideas
              </Typography>
              <Stack direction={'row'} spacing={10}>
                <Button variant="outlined" LinkComponent={Link} href={`${routes.company.startupIdeas}`}>
                  Explore all
                </Button>
                <Button
                  variant="contained"
                  endIcon={<AddCircleOutlineSharpIcon />}
                  onClick={() => {
                    if (!token) {
                      toast.error('Please login')
                      navigate(`${routes.login}?path=${routes.idea.create}`)
                    } else {
                      navigate(`${routes.idea.create}`)
                    }
                  }}
                >
                  Propose idea
                </Button>
              </Stack>
            </Box>
            <Box sx={{ mt: 16 }}>
              {ideaLoding ? (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                      <Box>
                        <Skeleton
                          variant="circular"
                          height={322}
                          sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {ideaListData?.list?.map((ideaListItem, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                      <Link target="_blank" to={`${routes.idea.detail}?id=${ideaListItem?.id}`}>
                        <InstitutionCard
                          icon={ideaListItem.avatar}
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
          </Box>
          <Box sx={styles.companiesBox}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h2" fontSize={24} color={'#FFF9F9'}>
                Top Сompanies
              </Typography>
              <Button
                variant="contained"
                sx={{ border: ' 1px solid #FFFFFF;' }}
                LinkComponent={Link}
                href={`${routes.company.topCompanies}`}
              >
                Explore all
              </Button>
            </Box>
            <Box sx={{ mt: 16 }}>
              {topCompaniesLoding ? (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                      <Box>
                        <Skeleton
                          variant="circular"
                          height={322}
                          sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {topCompaniesData?.list?.map((ideaListItem: any, index: number) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                      <Box
                        onClick={() => {
                          navigate(
                            `${routes.company.summary}?${
                              ideaListItem?.thirdpartId !== 0
                                ? `thirdpartId=${ideaListItem?.thirdpartId}`
                                : `id=${ideaListItem?.companyId}`
                            }`
                          )
                        }}
                      >
                        <InstitutionCard
                          icon={ideaListItem.avatar}
                          status={ideaListItem.marketType}
                          title={ideaListItem.name}
                          isVerify={ideaListItem.isVerify}
                          desc={ideaListItem.bio}
                          isTopCompanies
                          likeAmount={{
                            dislikeCount: ideaListItem.dislikeCount,
                            likeCount: ideaListItem.likeCount,
                            myDislike: ideaListItem.myDislike,
                            myLike: ideaListItem.myLike
                          }}
                          acitve={ideaListItem.active}
                          objId={ideaListItem.thirdpartId}
                          refresh={companyInformationRefresh}
                          commentCount={ideaListItem.commentCount}
                          companyState={ideaListItem.companyState}
                          startup={ideaListItem.startup}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
          <Box sx={styles.institutionaBox}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h2" fontSize={24}>
                Institutional Investors
              </Typography>
              <Button variant="outlined" LinkComponent={Link} href={'/company/institutionInvestors'}>
                Explore all
              </Button>
            </Box>
            <Box sx={{ mt: 16 }}>
              {InstitutionInvestorsLoding ? (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={3} xl={3} key={index}>
                      <Box>
                        <Skeleton
                          variant="circular"
                          height={282}
                          sx={{ bgcolor: 'var(--ps-gray-30)', borderRadius: 20 }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid rowSpacing={24} columnSpacing={20} container>
                  {institutionInvestorsData?.list.map((item: any, i: number) => (
                    <Grid key={i} item xs={12} sm={6} md={3} lg={3} xl={3}>
                      <Box
                        onClick={() => {
                          navigate(
                            `${routes.company.summary}?${
                              item?.thirdpartId !== 0 ? `thirdpartId=${item?.thirdpartId}` : `id=${item?.companyId}`
                            }`
                          )
                        }}
                      >
                        <InstitutionCard
                          startup={item.startup}
                          title={item.name}
                          isVerify={item.isVerify}
                          acitve={item.active}
                          icon={item.avatar}
                          desc={item.bio}
                        />
                      </Box>
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

export default Company
