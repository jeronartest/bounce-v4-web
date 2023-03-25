import { Box, Button, Container, Skeleton, Stack, styled, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import AccountAvatar from 'bounceComponents/account/AccountAvatar'
import { useUserInfo } from 'state/users/hooks'
import { getLabelById } from 'utils'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import { routes } from 'constants/routes'

const StyledStatCard = styled(Box)({
  height: 100,
  display: 'grid',
  gap: 14,
  alignContent: 'center',
  backgroundColor: '#fff',
  borderRadius: '20px',
  p: {
    textAlign: 'center'
  }
})

export default function Dashboard() {
  const { userInfo } = useUserInfo()
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()

  return (
    <AccountLayout>
      <Box>
        <Container maxWidth="lg">
          <Box padding="40px 60px">
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
                      <Typography variant="body1" color="rgba(23, 23, 23, 0.7)" ml={10} sx={{ fontSize: 20 }}>
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
                gridTemplateColumns: { lg: '1fr 1fr 1fr', md: '1fr 1fr', xs: '1fr' },
                gap: 20
              }}
            >
              <PoolCard items={[]} title="Ongoing Auctions" />
              <PoolCard items={[]} title="Favorites Auctions" />
              <PoolCard items={[]} title="Pending Claim" />
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
                <StatCard name="Auction Participated" value="10" />
                <StatCard name="Auction Created" value="17" />
                <StatCard name="Auction Sale Volume" value="$107" />
                <StatCard name="Auction Buy Volume" value="$107" />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </AccountLayout>
  )
}

function PoolCard({ title, items }: { title: string; items: JSX.Element[][] }) {
  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '20px',
        padding: 16
      }}
    >
      <Typography fontWeight={500}>{title}</Typography>
      <Box
        height={240}
        sx={{
          overflow: 'auto'
        }}
      >
        <Box
          sx={{
            pl: '10px'
          }}
        >
          {items.map((item, idx) => (
            <Box display={'grid'} key={idx} gridTemplateColumns="1fr 4fr 2fr" gap={8}>
              {item[0]}
              {item[1]}
              {item[2]}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function StatCard({ name, value }: { name: string; value: string | number }) {
  return (
    <StyledStatCard>
      <Typography color={'#908E96'}>{name}</Typography>
      <Typography fontSize={22} fontWeight={500} color="#2663FF">
        {value}
      </Typography>
    </StyledStatCard>
  )
}
