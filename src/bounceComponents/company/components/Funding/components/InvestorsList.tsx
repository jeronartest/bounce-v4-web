import { Avatar, Box, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { getLabel } from 'utils'
import NoData from 'bounceComponents/common/NoData'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import Tooltip from 'bounceComponents/common/Tooltip'
import { ICompanyInvestorsListItems } from 'api/company/type'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import { useQueryParams } from 'hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export type IInvestorsListProps = {
  dataList: any
  optionDatas: any
}

const InvestorsList: React.FC<IInvestorsListProps> = ({ dataList, optionDatas }) => {
  const navigate = useNavigate()
  const { thirdpartId } = useQueryParams()
  if (!dataList?.data?.list?.length || thirdpartId) {
    return <NoData color="var(--ps-gray-900)" svgColor="#F1F1F1" />
  }

  const handleLink = (item: ICompanyInvestorsListItems) => {
    if (item.investorType === 1) {
      return navigate(`${routes.profile.summary}?id=${item.userId}`)
    }
    return navigate(`${routes.company.summary}?thirdpartId=${item.thirdpartId}`)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={19}>
        {dataList?.data?.list?.map((item: any, index: number) => (
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2} key={index}>
            <Stack
              sx={{
                border: '1px solid rgba(23, 23, 23, 0.1)',
                borderRadius: 20,
                padding: '20px 24px 21px 24px',
                textAlign: 'center',
                alignItems: 'center',
                height: 161,
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
              <Stack
                direction={'row'}
                alignItems="center"
                justifyContent={'center'}
                spacing={8}
                style={{ marginTop: 16, width: '100%' }}
              >
                <Tooltip title={item?.userInfo.name} arrow placement="top">
                  <Typography
                    variant="h4"
                    color={'var(--ps-blue)'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    overflow="hidden"
                    sx={{ cursor: 'pointer', maxWidth: '100%', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => handleLink(item)}
                  >
                    {item?.userInfo.name}
                  </Typography>
                </Tooltip>
                <VerifiedIcon isVerify={item?.isVerify} />
              </Stack>
              <Typography variant="body2" color={'var(--ps-gray-700)'}>
                {getLabel(item?.investorType, 'investorType', optionDatas?.investorTypeOpt)}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default InvestorsList
