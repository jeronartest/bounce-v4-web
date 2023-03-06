import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs'
import { getLabel } from 'utils'
import { ReactComponent as EditBtnSVG } from 'assets/imgs/profile/investments/edit-btn.svg'
import { IInvestmentItems } from 'api/profile/type'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export type IProfileInvestmentsListProps = {
  list: IInvestmentItems[]
  showOperation?: boolean
  handleEdit?: (v: { data: IInvestmentItems; index: number }) => void
}

const ProfileInvestmentsList: React.FC<IProfileInvestmentsListProps> = ({
  list,
  showOperation = false,
  handleEdit
}) => {
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()

  const handleLink = (item: IInvestmentItems) => {
    if (item?.companyId) {
      return navigate(`${routes.company.summary}?id=${item?.companyId}`)
    }
    if (item?.thirdpartId) {
      return navigate(`${routes.company.summary}?thirdpartId=${item?.thirdpartId}`)
    }
    return
  }

  return (
    <Box>
      {list?.map((v, i) => (
        <Stack
          key={i}
          direction="row"
          sx={{
            background: 'var(--ps-gray-50)',
            borderRadius: '20px',
            marginBottom: 8,
            padding: '14px 0px 14px 10px',
            '&:hover': {
              background: 'var(--ps-gray-200)'
            }
          }}
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" sx={{ flex: '2 1' }}>
            <Avatar
              alt=""
              src={v?.company?.avatar || CompanyDefaultSVG}
              sx={{
                width: 32,
                height: 32,
                '&:hover': {
                  cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default'
                }
              }}
              onClick={() => handleLink(v)}
            />
            <Typography
              variant="h5"
              ml={12}
              mr={8}
              sx={{
                maxWidth: showOperation ? 180 : 360,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': {
                  cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default',
                  textDecoration: v?.companyId || v?.thirdpartId ? 'underline' : 'none'
                }
              }}
              onClick={() => handleLink(v)}
            >
              {v?.company?.name}
            </Typography>
            <VerifiedIcon isVerify={!!v?.isVerify} sx={{ mr: 8 }} />
            <Typography
              variant="body2"
              sx={{ background: ' rgba(23, 23, 23, 0.05)', borderRadius: 10, padding: '6px 8px' }}
            >
              {getLabel(v.investType, 'investment_type', optionDatas?.investmentTypeOpt)}
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ flex: '1 1' }}>
            {Number(v.investType) === 1 ? `${v.investAmount}%` : `$${v.investAmount}`}
          </Typography>
          <Typography variant="body1" sx={{ flex: '1 1' }}>
            {dayjs(v.investDate * 1000).format('MMM YYYY')}
          </Typography>
          {showOperation && (
            <IconButton edge="end" onClick={() => handleEdit({ data: v, index: i })} sx={{ marginRight: 10 }}>
              <EditBtnSVG />
            </IconButton>
          )}
        </Stack>
      ))}
    </Box>
  )
}

export default ProfileInvestmentsList
