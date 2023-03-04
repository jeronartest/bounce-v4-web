import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import React from 'react'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { show } from '@ebay/nice-modal-react'
import EducationForm from '../EducationForm'
import { ReactComponent as EditBtnSVG } from 'assets/imgs/profile/investments/edit-btn.svg'
import { educationItems } from 'api/profile/type'
import { getLabel } from '@/utils'
import { RootState } from '@/store'
import MuiDialog from 'bounceComponents/common/Dialog'
import EducationDefaultSVG from 'assets/imgs/defaultAvatar/education.svg'

export type IEducationListProps = {
  list: educationItems[]
  onEdit: (data: educationItems, index: number) => void
  onDelete: (index: number) => void
}

const EducationList: React.FC<IEducationListProps> = ({ list, onEdit, onDelete }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const handleEdit = v => {
    show(MuiDialog, {
      title: 'Edit the education',
      fullWidth: true,
      children: <EducationForm editData={v} onEdit={onEdit} onDelete={onDelete} />
    })
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
            padding: '20px'
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0, marginRight: 20, marginTop: 0 }}>
            <Avatar
              alt=""
              src={v?.university?.avatar || EducationDefaultSVG}
              sx={{
                width: 68,
                height: 68,
                '&:hover': {
                  cursor: v?.university?.link ? 'pointer' : 'default'
                }
              }}
              component={'a'}
              target={v?.university?.link ? '_blank' : '_self'}
              href={v?.university?.link ? v?.university?.link : 'javascript:void(0)'}
            />
          </ListItemAvatar>
          <Box sx={{ position: 'relative', paddingRight: 40, flex: 1 }}>
            <ListItemText
              primary={
                <Typography
                  variant="h2"
                  component={'a'}
                  target={v?.university?.link ? '_blank' : '_self'}
                  href={v?.university?.link ? v?.university?.link : 'javascript:void(0)'}
                  sx={{
                    fontSize: '20px',
                    lineHeight: '20px',
                    marginBottom: 6,
                    wordBreak: 'break-word',
                    '&:hover': {
                      textDecoration: v?.university?.link ? 'underline' : 'none',
                      cursor: v?.university?.link ? 'pointer' : 'default'
                    }
                  }}
                >
                  {v?.university?.name}
                </Typography>
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
                    <Typography variant="body2">{getLabel(v.degree, 'degree', optionDatas?.degreeOpt)}</Typography>
                    {/* <Typography variant="body2">{v.major}</Typography> */}
                    <Typography variant="body2">
                      {`${dayjs(v.startTime * 1000).format('YYYY')}-${dayjs(v.endTime * 1000).format('YYYY')}(${dayjs(
                        v.endTime * 1000
                      ).diff(dayjs(v.startTime * 1000), 'year')} years)`}
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
                      WebkitLineClamp: 2
                    }}
                  >
                    {v.description}
                  </Typography>
                </Stack>
              }
              disableTypography
              sx={{ flex: '1 1', margin: 0 }}
            />
            <ListItemSecondaryAction sx={{ right: '10px', top: '32%' }}>
              <IconButton edge="end" onClick={() => handleEdit({ data: v, index: i })}>
                <EditBtnSVG />
              </IconButton>
            </ListItemSecondaryAction>
          </Box>
        </ListItem>
      ))}
    </List>
  )
}

export default EducationList
