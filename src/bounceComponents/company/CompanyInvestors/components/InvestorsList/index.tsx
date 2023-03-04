import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { show } from '@ebay/nice-modal-react'
import { useRouter } from 'next/router'
import InvestorsForm from '../InvestorsForm'
import { ReactComponent as EditBtnSVG } from '@/assets/imgs/profile/investments/edit-btn.svg'
import { getLabel } from '@/utils'
import { RootState } from '@/store'
import { ICompanyInvestorsListItems } from '@/api/company/type'
import MuiDialog from '@/components/common/Dialog'
import VerifiedIcon from '@/components/common/VerifiedIcon'
import DefaultAvatarSVG from '@/assets/imgs/profile/yellow_avatar.svg'
import CompanyDefaultSVG from '@/assets/imgs/defaultAvatar/company.svg'

export type IInvestorsListProps = {
  list: ICompanyInvestorsListItems[]
  onEdit: (data: ICompanyInvestorsListItems, index: number) => void
  onDelete: (index: number) => void
}

const InvestorsList: React.FC<IInvestorsListProps> = ({ list, onEdit, onDelete }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const router = useRouter()

  const handleEdit = (v) => {
    const temp = {
      data: {
        userInfo: v.data.userInfo,
        userId: v.data.userId,
        thirdpartId: v.data.thirdpartId,
        linkedinName: v.data.linkedinName,
        companyId: v.data.companyId,
        investorType: v.data.investorType,
      },
      index: v.index,
    }
    show(MuiDialog, {
      title: 'Edit the investor',
      fullWidth: true,
      children: <InvestorsForm editData={temp} onEdit={onEdit} onDelete={onDelete} />,
    })
  }
  const handleLink = (item: ICompanyInvestorsListItems) => {
    if (item.investorType === 1) {
      return router.push(`/profile/summary?id=${item.userId}`)
    }
    return router.push(`/company/summary?thirdpartId=${item.thirdpartId}`)
  }

  return (
    <List disablePadding>
      {list.map((v, i) => (
        <ListItem
          key={i}
          sx={{
            background: 'var(--ps-gray-50)',
            borderRadius: '20px',
            marginBottom: 8,
            padding: '14px 0px 14px 10px',
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0, marginRight: 12 }}>
            <Avatar
              alt=""
              src={v.userInfo?.avatar || (v?.investorType === 1 ? DefaultAvatarSVG : CompanyDefaultSVG)}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => handleLink(v)}
            />
          </ListItemAvatar>
          <ListItemText sx={{ flex: '1 1' }}>
            <Stack direction={'row'} alignItems="center" spacing={8}>
              <Typography
                variant="h4"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => handleLink(v)}
              >
                {v.userInfo?.name}
              </Typography>
              <VerifiedIcon isVerify={v?.isVerify} />
            </Stack>
          </ListItemText>
          <ListItemText
            primary={getLabel(v.investorType, 'investorType', optionDatas?.investorTypeOpt)}
            primaryTypographyProps={{ variant: 'body1' }}
            sx={{ flex: '1 1' }}
          />
          <ListItemSecondaryAction sx={{ right: '24px' }}>
            <IconButton edge="end" onClick={() => handleEdit({ data: v, index: i })}>
              <EditBtnSVG />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default InvestorsList
