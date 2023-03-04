import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { show } from '@ebay/nice-modal-react'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import TeamForm from '../TeamForm'
import { ReactComponent as EditBtnSVG } from 'assets/imgs/profile/investments/edit-btn.svg'
import { RootState } from '@/store'
import { getPrimaryRoleLabel } from '@/utils'
import MuiDialog from 'bounceComponents/common/Dialog'
import { ICompanyTeamListItems } from 'api/company/type'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'

export type ITeamListProps = {
  list: ICompanyTeamListItems[]
  onEdit: (data: ICompanyTeamListItems, index: number) => void
  onDelete: (index: number) => void
}

const TeamList: React.FC<ITeamListProps> = ({ list, onEdit, onDelete }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const router = useRouter()

  const getrolesName = item => {
    const temp = item.map((v: number) => getPrimaryRoleLabel(v, optionDatas?.primaryRoleOpt))
    return temp.length === 1 ? temp : temp.join(', ')
  }

  const handleEdit = v => {
    const temp = {
      data: {
        user: {
          userId: v.data.userId,
          name: v.data.userName,
          avatar: v.data.userAvatar
        },
        roleIds: v.data.roleIds
      },
      index: v.index
    }
    show(MuiDialog, {
      title: 'Edit the team member',
      fullWidth: true,
      children: <TeamForm editData={temp} onEdit={onEdit} onDelete={onDelete} />
    })
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
            padding: '14px 0px 14px 10px'
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0, marginRight: 12 }}>
            <Avatar
              alt=""
              src={v.userAvatar || DefaultAvatarSVG}
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => router.push(`/profile/summary?id=${v?.userId}`)}
            />
          </ListItemAvatar>
          <ListItemText sx={{ flex: '1 1' }}>
            <Stack direction={'row'} alignItems="center" spacing={8}>
              <Typography
                variant="h4"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => router.push(`/profile/summary?id=${v?.userId}`)}
              >
                {v.userName}
              </Typography>
              <VerifiedIcon isVerify={v?.isVerify} />
            </Stack>
          </ListItemText>
          <ListItemText
            primary={getrolesName(v.roleIds)}
            primaryTypographyProps={{ variant: 'body1' }}
            sx={{ flex: '2 1' }}
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

export default TeamList
