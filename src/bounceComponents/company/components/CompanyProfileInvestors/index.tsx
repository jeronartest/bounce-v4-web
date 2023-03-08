import React, { useEffect, useState } from 'react'
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import ViewMoreListBox from 'bounceComponents/company/ViewMoreListBox'
import { getCompanyInvestors } from 'api/company'
import { ICompanyInvestorsListItems, ICompanyListItems } from 'api/company/type'
import { getLabel } from 'utils'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import Tooltip from 'bounceComponents/common/Tooltip'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import { useOptionDatas } from 'state/configOptions/hooks'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

export type ICompanyProfileInvestorsProps = {
  targetCompanyId?: number
}
const DefaultPageSize = 6

const CompanyProfileInvestors: React.FC<ICompanyProfileInvestorsProps> = ({ targetCompanyId }) => {
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()
  const [showBtn, setShowBtn] = useState<boolean>(false)
  const [dataList, setDataList] = useState<ICompanyInvestorsListItems[]>([])

  useEffect(() => {
    setDataList([])
  }, [targetCompanyId])

  const { data, pagination, loading, run } = usePagination<ICompanyListItems<ICompanyInvestorsListItems>, Params>(
    async ({ current, pageSize }) => {
      const resp = await getCompanyInvestors({
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
      manual: true,
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

  useEffect(() => {
    if (!!targetCompanyId) {
      run({ pageSize: DefaultPageSize, current: 1 })
    }
  }, [targetCompanyId, run])
  if (dataList?.length === 0) {
    return <></>
  }

  const handleLink = (item: ICompanyInvestorsListItems) => {
    if (item.investorType === 1) {
      return navigate(`${routes.profile.summary}?id=${item.userId}`)
    }
    return navigate(`${routes.company.summary}?thirdpartId=${item.thirdpartId}`)
  }
  return (
    <ViewMoreListBox
      show={showBtn}
      title={'Investors'}
      loading={loading}
      handleClick={() => {
        pagination.changeCurrent(pagination.current + 1)
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={19}>
          {dataList.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} lg={2} xl={2} key={index}>
              <Stack
                sx={{
                  border: '1px solid rgba(23, 23, 23, 0.1)',
                  borderRadius: 20,
                  padding: '13px 16px',
                  textAlign: 'center',
                  alignItems: 'center',
                  height: 156,
                  '&:hover': {
                    boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(23, 23, 23, 0.2)'
                  }
                }}
                spacing={4}
              >
                <Avatar
                  src={item?.userInfo?.avatar || (item?.investorType === 1 ? DefaultAvatarSVG : CompanyDefaultSVG)}
                  sx={{
                    width: 60,
                    height: 60,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleLink(item)}
                />
                <Stack direction={'row'} alignItems="center" spacing={8} style={{ maxWidth: '100%' }}>
                  <Tooltip title={item?.userInfo.name} arrow placement="top">
                    <Typography
                      variant="h4"
                      color={'var(--ps-blue)'}
                      textOverflow={'ellipsis'}
                      whiteSpace={'nowrap'}
                      overflow="hidden"
                      sx={{
                        cursor: 'pointer',
                        maxWidth: '100%',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleLink(item)}
                    >
                      {item?.userInfo.name}
                    </Typography>
                  </Tooltip>
                  <VerifiedIcon isVerify={item?.isVerify} />
                </Stack>

                <Typography variant="body1" color={'var(--ps-gray-700)'} fontSize={12}>
                  {getLabel(item?.investorType, 'investorType', optionDatas?.investorTypeOpt)}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ViewMoreListBox>
  )
}

export default CompanyProfileInvestors
