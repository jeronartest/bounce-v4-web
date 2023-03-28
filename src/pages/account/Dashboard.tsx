import { Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import AccountAvatar from 'bounceComponents/account/AccountAvatar'
import { useUserInfo } from 'state/users/hooks'
import { getCurrentTimeStamp, getLabelById } from 'utils'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import { routes } from 'constants/routes'
import { useDashboardStat, useDashboardUserCollect, useDashboardUserCreated } from 'bounceHooks/account/useDashboard'
import { formatGroupNumber } from 'utils/number'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import { Timer } from 'components/Timer'
import {
  DashboardNoData,
  DashboardPoolCard,
  DashboardShowCategoryName,
  DashboardStatCard,
  DashboardToPoolButton
} from 'bounceComponents/account/Dashboard'
import { DashboardQueryType } from 'api/account/types'
import { useMemo } from 'react'

const btnStyle = {
  height: 26,
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
  padding: '0 8px',
  borderRadius: 20
}

export default function Dashboard() {
  const { userInfo } = useUserInfo()
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()
  const { data: dashboardStat } = useDashboardStat()

  return (
    <AccountLayout>
      <Box>
        <Container maxWidth="lg">
          <Box padding="40px 20px">
            <Typography variant="h3" fontSize={30}>
              Dashboard
            </Typography>
            <Box pt={48} display="flex">
              <Box sx={{ position: 'relative', width: '120px' }}>
                {!userInfo?.avatar ? (
                  <Skeleton variant="circular" width={120} height={120} sx={{ background: 'var(--ps-gray-50)' }} />
                ) : (
                  <AccountAvatar src={userInfo?.avatar?.fileThumbnailUrl || userInfo?.avatar?.fileUrl} />
                )}
                {userInfo?.isVerify && (
                  <VerifiedIcon
                    isVerify={userInfo.isVerify}
                    width={42}
                    height={42}
                    showVerify
                    sx={{ position: 'absolute', right: -5, bottom: 10 }}
                  />
                )}
              </Box>
              <Box sx={{ width: '100%', ml: 24, mt: 30 }}>
                <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                  {!userInfo?.fullName && !userInfo?.fullNameId ? (
                    <Skeleton variant="rectangular" width={280} height={46} sx={{ background: 'var(--ps-gray-50)' }} />
                  ) : (
                    <Stack direction={'row'} alignItems="center">
                      <Typography variant="h1" fontWeight={500}>
                        {userInfo?.fullName}
                      </Typography>
                      <Typography variant="body1" color="#2663FF" ml={10} sx={{ fontSize: 20 }}>
                        {userInfo?.fullNameId && `#${userInfo?.fullNameId}`}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Stack direction={'row'} alignItems="center" justifyContent="space-between" spacing={12} mt={6}>
                  <Box>
                    {userInfo?.publicRole?.map((item: any) => {
                      const label = getLabelById(item, 'role', optionDatas?.publicRoleOpt)
                      return (
                        <Box key={item} sx={{ padding: '7px 12px', background: 'var(--ps-gray-50)', borderRadius: 16 }}>
                          {label}
                        </Box>
                      )
                    })}
                  </Box>
                  <Button
                    onClick={() => {
                      navigate(routes.account.myProfile)
                    }}
                    size="small"
                    sx={{
                      background: 'none',
                      '&:hover': {
                        background: 'none',
                        color: 'var(--ps-blue)'
                      }
                    }}
                  >
                    <EditSVG style={{ marginRight: 10 }} />
                    Edit portfolio
                  </Button>
                </Stack>
              </Box>
            </Box>
            <Box
              mt={50}
              sx={{
                display: 'grid',
                gridTemplateColumns: { lg: '346fr 346fr 346fr', md: '346fr 346fr', xs: '1fr' },
                gap: 30
              }}
            >
              <CreateAuctionsList title="Ongoing Auctions" queryType={DashboardQueryType.ongoing} />
              <FavoritesAuctionsList />
              <PendingClaimAuctionsList />
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            background: '#F5F5F5',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Container maxWidth="lg">
            <Box padding="50px 60px">
              <Typography variant="h3" fontSize={24}>
                Auction Statistics
              </Typography>
              <Box
                display={'grid'}
                mt={24}
                sx={{
                  gridTemplateColumns: { lg: '1fr 1fr 1fr 1fr', md: '1fr 1fr' }
                }}
                gap={20}
              >
                <DashboardStatCard
                  name="Auction Participated"
                  value={formatGroupNumber(dashboardStat?.participantCount || 0)}
                />
                <DashboardStatCard name="Auction Created" value={formatGroupNumber(dashboardStat?.createdCount || 0)} />
                <DashboardStatCard
                  name="Auction Sale Volume"
                  value={formatGroupNumber(Number(dashboardStat?.saledVolume) || 0, '$', 2)}
                />
                <DashboardStatCard
                  name="Auction Buy Volume"
                  value={formatGroupNumber(Number(dashboardStat?.buyVolume) || 0, '$', 2)}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </AccountLayout>
  )
}

function FavoritesAuctionsList() {
  const { data, loading } = useDashboardUserCollect()
  const curTime = getCurrentTimeStamp()
  return (
    <DashboardPoolCard title="Favorites Auctions">
      <>
        {loading ? (
          <BounceAnime />
        ) : !data?.length ? (
          <DashboardNoData />
        ) : (
          data?.map((item, idx) => (
            <Box
              display={'grid'}
              key={idx}
              gridTemplateColumns="1.3fr 4fr 2fr"
              gap={10}
              sx={{
                padding: '4px 0 4px 10px',
                alignItems: 'center',
                background: '#F5F5F5',
                borderRadius: 100
              }}
            >
              <Typography fontSize={12}>#{item.poolId}</Typography>
              <DashboardShowCategoryName category={item.category} backedChainId={item.chainId} />
              <Box display={'flex'} justifyContent="right">
                {curTime < item.openAt ? (
                  <Box sx={{ ...btnStyle, background: '#E6E6E6' }}>
                    <Timer timer={item.openAt * 1000} />
                  </Box>
                ) : (
                  <DashboardToPoolButton text="Participate" poolId={item.poolId} backedChainId={item.chainId} />
                )}
              </Box>
            </Box>
          ))
        )}
      </>
    </DashboardPoolCard>
  )
}
function CreateAuctionsList({ title, queryType }: { title: string; queryType: DashboardQueryType }) {
  const { data, loading } = useDashboardUserCreated(queryType)
  return (
    <DashboardPoolCard title={title}>
      <>
        {loading ? (
          <BounceAnime />
        ) : !data?.length ? (
          <DashboardNoData />
        ) : (
          data?.map((item, idx) => (
            <Box
              display={'grid'}
              key={idx}
              gridTemplateColumns="1.3fr 4fr 2fr"
              gap={10}
              sx={{
                padding: '4px 0 4px 10px',
                alignItems: 'center',
                background: '#F5F5F5',
                borderRadius: 100
              }}
            >
              <Typography fontSize={12}>#{item.poolId}</Typography>
              <DashboardShowCategoryName category={item.category} backedChainId={item.chainId} />
              <Box display={'flex'} justifyContent="right">
                <DashboardToPoolButton
                  text={queryType === DashboardQueryType.ongoing ? 'Check' : 'Claim'}
                  poolId={item.poolId}
                  backedChainId={item.chainId}
                />
              </Box>
            </Box>
          ))
        )}
      </>
    </DashboardPoolCard>
  )
}

function PendingClaimAuctionsList() {
  const { data, loading } = useDashboardUserCreated(DashboardQueryType.claim)
  const { data: colletData, loading: colletLoading } = useDashboardUserCollect(DashboardQueryType.claim)

  const list = useMemo(() => {
    return [...(data || []), ...(colletData || [])]
  }, [colletData, data])

  return (
    <DashboardPoolCard title={'Pending Claim'}>
      <>
        {loading || colletLoading ? (
          <BounceAnime />
        ) : !data?.length ? (
          <DashboardNoData />
        ) : (
          list.map((item, idx) => (
            <Box
              display={'grid'}
              key={idx}
              gridTemplateColumns="1.3fr 4fr 2fr"
              gap={10}
              sx={{
                padding: '4px 0 4px 10px',
                alignItems: 'center',
                background: '#F5F5F5',
                borderRadius: 100
              }}
            >
              <Typography fontSize={12}>#{item.poolId}</Typography>
              <DashboardShowCategoryName category={item.category} backedChainId={item.chainId} />
              <Box display={'flex'} justifyContent="right">
                <DashboardToPoolButton text={'Claim'} poolId={item.poolId} backedChainId={item.chainId} />
              </Box>
            </Box>
          ))
        )}
      </>
    </DashboardPoolCard>
  )
}
