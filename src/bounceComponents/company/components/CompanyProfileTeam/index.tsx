import React, { useEffect, useState } from 'react'
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
// import { show } from '@ebay/nice-modal-react'
import ViewMoreListBox from 'bounceComponents/company/ViewMoreListBox'
import { ICompanyMembersListData, ICompanyListItems } from 'api/company/type'
import { getCompanyMembersList } from 'api/company'
import { getPrimaryRoleLabel } from 'utils'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { useOptionDatas } from 'state/configOptions/hooks'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

export type ICompanyProfileTeamProps = {
  targetCompanyId?: number
}

const DefaultPageSize = 3

const CompanyProfileTeam: React.FC<ICompanyProfileTeamProps> = ({ targetCompanyId }) => {
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()
  const [showBtn, setShowBtn] = useState<boolean>(false)
  const [dataList, setDataList] = useState<ICompanyMembersListData[]>([])
  const getrolesName = (item: any[]) => {
    const temp = item?.map((v: number) => getPrimaryRoleLabel(v, optionDatas?.primaryRoleOpt))
    return temp?.length === 1 ? temp : temp?.join(' & ')
  }

  useEffect(() => {
    setDataList([])
  }, [targetCompanyId])

  const { pagination, loading, data } = usePagination<ICompanyListItems<ICompanyMembersListData>, Params>(
    async ({ current, pageSize }) => {
      const resp = await getCompanyMembersList({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        companyId: targetCompanyId || 0
      })

      return {
        total: resp.data.total,
        list: resp.data.list
      }
    },
    {
      onSuccess: res => {
        setDataList(dataList.concat(res.list))
      },
      ready: !!targetCompanyId,
      defaultPageSize: DefaultPageSize,
      refreshDeps: [targetCompanyId]
    }
  )

  useEffect(() => {
    if (data?.total && dataList.length < data?.total) {
      setShowBtn(true)
    } else {
      setShowBtn(false)
    }
  }, [dataList, data])
  if (dataList.length === 0) {
    return <></>
  }

  return (
    <ViewMoreListBox
      show={showBtn}
      title={'Team'}
      loading={loading}
      handleClick={() => {
        pagination.changeCurrent(pagination.current + 1)
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={19}>
          {dataList.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={index}>
              <Box
                sx={{
                  border: '1px solid rgba(23, 23, 23, 0.1)',
                  borderRadius: 20,
                  padding: '20px 20px 20px 16px',
                  display: 'flex',
                  height: 156,
                  '&:hover': {
                    boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(23, 23, 23, 0.2)'
                  }
                }}
              >
                <Avatar
                  src={item.userAvatar || DefaultAvatarSVG}
                  sx={{
                    width: 100,
                    height: 100,
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`${routes.profile.summary}?id=${item.userId}`)}
                />
                <Stack spacing={4} ml={14}>
                  <Stack direction={'row'} alignItems={'center'} spacing={8}>
                    <Typography
                      variant="h2"
                      fontSize={16}
                      fontWeight={500}
                      color={'var(--ps-blue)'}
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => navigate(`${routes.profile.summary}?id=${item.userId}`)}
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
                      lineHeight={'20px'}
                      variant="body1"
                      color={'var(--ps-gray-900)'}
                      textOverflow={'ellipsis'}
                      overflow="hidden"
                      display="-webkit-box"
                      sx={{
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: getrolesName(item.roleIds)?.length > 28 ? 2 : 3
                      }}
                    >
                      {item.bio || 'No description yet'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ViewMoreListBox>
  )
}

export default CompanyProfileTeam
