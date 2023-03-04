import { Avatar, Grid, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '@/store'
import { useGetCompanyTeam } from '@/hooks/company/useGetCompanyTeam'
import { getPrimaryRoleLabel } from '@/utils'
import { ICompanyOverviewInfo } from '@/api/company/type'
import NoData from '@/components/common/NoData'
import DefaultAvatarSVG from '@/assets/imgs/profile/yellow_avatar.svg'
import VerifiedIcon from '@/components/common/VerifiedIcon'

export type ITeamProps = {
  targetCompanyId: number
}

const Team: React.FC<ITeamProps> = ({ targetCompanyId }) => {
  const { data, runAsync: runGetCompanyTeam } = useGetCompanyTeam()
  const router = useRouter()
  const { thirdpartId } = router.query
  useEffect(() => {
    !!targetCompanyId && runGetCompanyTeam({ limit: 1000, offset: 0, companyId: targetCompanyId })
  }, [runGetCompanyTeam, targetCompanyId])
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const getrolesName = (item) => {
    const temp = item?.map((v: number) => getPrimaryRoleLabel(v, optionDatas?.primaryRoleOpt))
    return temp?.length === 1 ? temp : temp?.join(' & ')
  }

  return (
    <Box sx={{ p: '19px 48px 60px 48px' }}>
      <Box sx={{ flexGrow: 1 }} mt={24}>
        <Grid container spacing={19}>
          {data?.data?.list?.length === 0 || thirdpartId ? (
            <NoData color="var(--ps-gray-900)" svgColor="#F1F1F1" />
          ) : (
            <>
              {data?.data?.list?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
                  <Box
                    sx={{
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 20,
                      padding: '20px  16px',
                      display: 'flex',
                      height: 156,
                      '&:hover': {
                        boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(23, 23, 23, 0.2)',
                      },
                    }}
                  >
                    <Avatar
                      src={item.userAvatar || DefaultAvatarSVG}
                      sx={{
                        width: 100,
                        height: 100,
                        alignSelf: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => router.push(`/profile/summary?id=${item.userId}`)}
                    />
                    <Stack spacing={4} ml={12}>
                      <Stack direction={'row'} alignItems="center" spacing={8}>
                        <Typography
                          variant="h2"
                          fontSize={16}
                          fontWeight={500}
                          color={'var(--ps-blue)'}
                          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                          onClick={() => router.push(`/profile/summary?id=${item.userId}`)}
                        >
                          {item.userName}
                        </Typography>
                        <VerifiedIcon isVerify={item?.isVerify} />
                      </Stack>

                      <Typography variant="body2" color={'var(--ps-gray-700)'}>
                        {getrolesName(item.roleIds)}
                      </Typography>
                      <Box style={{ marginTop: 12 }}>
                        <Typography
                          variant="body1"
                          lineHeight={'20px'}
                          color={'var(--ps-gray-900)'}
                          textOverflow={'ellipsis'}
                          overflow="hidden"
                          display="-webkit-box"
                          sx={{
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: getrolesName(item.roleIds)?.length > 28 ? 2 : 3,
                          }}
                        >
                          {item.bio || 'No description yet'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
    </Box>
  )
}

export default Team
