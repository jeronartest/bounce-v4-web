import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { show } from '@ebay/nice-modal-react'
import { useRouter } from 'next/router'
import ExperienceForm from '../ExperienceForm'
import { ReactComponent as EditBtnSVG } from '@/assets/imgs/profile/investments/edit-btn.svg'
import { experienceItems } from '@/api/profile/type'
import { RootState } from '@/store'
import { getPrimaryRoleLabel } from '@/utils'
import MuiDialog from '@/components/common/Dialog'
import CompanyDefaultSVG from '@/assets/imgs/defaultAvatar/company.svg'
import VerifiedIcon from '@/components/common/VerifiedIcon'

export type IExperienceListProps = {
  list: experienceItems[]
  onEdit: (data: experienceItems, index: number) => void
  onDelete: (index: number) => void
}

const ExperienceList: React.FC<IExperienceListProps> = ({ list, onEdit, onDelete }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const router = useRouter()

  const handleEdit = (v) => {
    const temp = { data: { ...v.data, isCurrently: v.data.isCurrently === 2 }, index: v.index }
    show(MuiDialog, {
      title: 'Edit the experience',
      fullWidth: true,
      children: <ExperienceForm editData={temp} onEdit={onEdit} onDelete={onDelete} />,
    })
  }

  const handleLink = (item: experienceItems) => {
    if (item?.companyId) {
      return router.push(`/company/summary?id=${item?.companyId}`)
    }
    if (item?.thirdpartId) {
      return router.push(`/company/summary?thirdpartId=${item?.thirdpartId}`)
    }
    return
  }

  return (
    <List disablePadding>
      {list.map((v, i) => (
        <ListItem
          alignItems="flex-start"
          key={i}
          sx={{
            background: 'var(--ps-gray-50)',
            borderRadius: '20px',
            marginBottom: 8,
            padding: '20px',
            '&:hover': {
              background: 'var(--ps-gray-200)',
            },
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0, marginRight: 20, marginTop: 0 }}>
            <Avatar
              alt=""
              src={v?.company?.avatar || CompanyDefaultSVG}
              sx={{
                width: 68,
                height: 68,
                '&:hover': {
                  cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default',
                },
              }}
              onClick={() => handleLink(v)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Stack direction={'row'} alignItems="center" spacing={8} marginBottom={6}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '20px',
                    lineHeight: '20px',
                    '&:hover': {
                      cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default',
                      textDecoration: v?.companyId || v?.thirdpartId ? 'underline' : 'none',
                    },
                  }}
                  onClick={() => handleLink(v)}
                >
                  {v?.company?.name}
                </Typography>
                <VerifiedIcon isVerify={v?.isVerify} />
              </Stack>
            }
            secondary={
              <Stack spacing={14}>
                <Stack
                  direction="row"
                  color="var(--ps-gray-900)"
                  divider={
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      sx={{ borderColor: 'var(--ps-gray-300)' }}
                      flexItem
                    />
                  }
                  spacing={8}
                >
                  <Typography variant="body2">
                    {getPrimaryRoleLabel(v.position, optionDatas?.primaryRoleOpt)}
                  </Typography>
                  <Typography variant="body2">
                    {`${dayjs(v.startTime * 1000).format('YYYY')}-${
                      Number(v.isCurrently) === 2 ? 'Present' : dayjs(v.endTime * 1000).format('YYYY')
                    } (${dayjs(Number(v.isCurrently) === 2 ? dayjs() : dayjs(v.endTime * 1000)).diff(
                      dayjs(v.startTime * 1000),
                      'year',
                    )} years)`}
                  </Typography>
                </Stack>
                <Typography
                  variant="body1"
                  color="var(--ps-gray-700)"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {v.description}
                </Typography>
              </Stack>
            }
            disableTypography
            sx={{ flex: '1 1', margin: 0 }}
          />
          <ListItemSecondaryAction sx={{ right: '30px', top: '32%' }}>
            <IconButton edge="end" onClick={() => handleEdit({ data: v, index: i })}>
              <EditBtnSVG />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default ExperienceList
