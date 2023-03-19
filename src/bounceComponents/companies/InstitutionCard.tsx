import { Avatar, Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import moment from 'moment'
import ProjectCardSvg from '../common/ProjectCardSvg'
import LikeUnlike from '../common/LikeUnlike'
import VerifiedIcon from '../common/VerifiedIcon'
import { ReactComponent as CommentSVG } from 'assets/imgs/comment.svg'
import { ReactComponent as EditSVG } from 'assets/imgs/components/edit.svg'
import { ILikeUnlikeRes } from 'api/idea/type'
import { ReactComponent as DefaultAvatar } from 'assets/imgs/profile/default_avatar_ideas.svg'
import { getLabelById } from 'utils'
import { VerifyStatus } from 'api/profile/type'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useOptionDatas } from 'state/configOptions/hooks'

export type IInstitutionCardProps = {
  icon: string
  title: string
  isVerify: VerifyStatus
  desc: string
  ideaTitle?: string
  status?: number
  startup?: number
  likeAmount?: ILikeUnlikeRes
  isEdit?: boolean
  refresh?: any
  acitve: number
  companyState?: number
  isTopCompanies?: boolean
  publicRole?: number[]
  objId: number
  detail: boolean
  commentCount: number
}

const InstitutionCard: React.FC<Partial<IInstitutionCardProps>> = ({
  icon,
  title,
  ideaTitle,
  isVerify,
  likeAmount,
  isEdit,
  companyState,
  startup,
  objId,
  publicRole,
  desc,
  isTopCompanies,
  status,
  acitve,
  commentCount
}) => {
  const optionDatas = useOptionDatas()
  const navigate = useNavigate()
  const [initLikeAmount, setInitLikeAmount] = useState<ILikeUnlikeRes | undefined>(likeAmount)
  const getPublicPoleLable = (publicRoleId: number) => {
    return getLabelById(publicRoleId, 'role', optionDatas?.publicRoleOpt)
  }
  const hasRole = useMemo(() => {
    return publicRole && publicRole.length > 0
  }, [publicRole])
  return (
    <Paper
      sx={{
        cursor: 'pointer',
        borderRadius: 20,
        // height: ideaTitle && 330,
        p: 16,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        // height: !startup ? 322 : 282,
        '&:hover': {
          boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(23, 23, 23, 0.2)'
        }
      }}
      elevation={0}
    >
      <Box width={'100%'}>
        <Box display={'flex'} justifyContent={'space-between'}>
          {icon ? (
            <Avatar sx={{ width: 60, height: 60 }} src={icon} />
          ) : (
            <Box sx={{ width: 60, height: 60 }}>
              <DefaultAvatar />
            </Box>
          )}
          <Stack direction={'row'} spacing={4} height={24}>
            {acitve === 2 && (
              <Box
                sx={{
                  width: 55,
                  height: 24,
                  borderRadius: 20,
                  background: '#D4F5DE',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Typography variant="body2" color={'#259C4A'} margin={'0 auto'}>
                  Active
                </Typography>
              </Box>
            )}
            {!!status && <ProjectCardSvg status={status} />}
          </Stack>
        </Box>
        <Box justifyContent={'space-between'} display={'flex'}>
          <Stack direction={'row'} alignItems="center" spacing={8} mt={16}>
            <Typography
              variant="h4"
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
              overflow="hidden"
              sx={{
                alignItems: 'baseline',
                maxWidth: isVerify ? 198 : 228
              }}
            >
              {title}
            </Typography>
            {isVerify !== undefined && <VerifiedIcon isVerify={isVerify} />}
          </Stack>

          {isEdit && (
            <IconButton
              onClick={e => {
                e.preventDefault()
                navigate(`${routes.idea.create}?id=${objId}`)
              }}
            >
              <EditSVG />
            </IconButton>
          )}
        </Box>

        <Stack direction={'row'} spacing={4} mt={10} height={ideaTitle ? 48 : 24}>
          {ideaTitle && (
            <Typography
              variant="h4"
              textOverflow={'ellipsis'}
              // whiteSpace={'nowrap'}
              display="-webkit-box"
              overflow="hidden"
              sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, alignItems: 'baseline' }}
            >
              {ideaTitle}
            </Typography>
          )}
          {hasRole &&
            !ideaTitle &&
            publicRole?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 20,
                  p: '4px 8px',
                  background: 'var(--ps-gray-50)',
                  display: 'inline-flex',
                  overflow: index > 0 ? 'hidden' : 'visible'
                }}
              >
                <Typography variant="body2" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {getPublicPoleLable(item)}
                </Typography>
              </Box>
            ))}
          {!!companyState && !ideaTitle && (
            <Box
              sx={{
                borderRadius: 20,
                p: '4px 8px',
                background: 'var(--ps-gray-50)',
                display: 'inline-flex',
                overflow: !hasRole ? 'visible' : 'hidden'
              }}
            >
              <Typography variant="body2" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {getLabelById(companyState, 'state', optionDatas?.companyStateOpt)}
              </Typography>
            </Box>
          )}
          {!!startup && !ideaTitle && (
            <Box
              sx={{
                borderRadius: 20,
                p: '4px 8px',
                background: 'var(--ps-gray-50)',
                display: 'inline-flex',
                overflow: 'hidden'
              }}
            >
              <Typography variant="body2" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                Founded in {moment(startup * 1000).format('MMM YYYY')}
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography
          variant="body2"
          textOverflow={'ellipsis'}
          overflow="hidden"
          display="-webkit-box"
          height={ideaTitle ? 80 : 100}
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: ideaTitle ? 4 : 5,
            mt: 16,
            opacity: 0.8,
            lineHeight: '20px'
          }}
        >
          {desc || 'No description yet'}
        </Typography>

        {likeAmount && (
          <Box justifyContent={'space-between'} display={'flex'} mt={10}>
            {objId !== undefined && initLikeAmount !== undefined && (
              <LikeUnlike
                likeObj={isTopCompanies ? 2 : 3}
                objId={objId}
                likeAmount={initLikeAmount}
                onSuccess={res => {
                  setInitLikeAmount(res)
                }}
              />
            )}
            <Button
              sx={{
                height: 32,
                minWidth: 0,
                background: 'none',
                color: 'var(--ps-gray-900)'
              }}
            >
              <CommentSVG />
              <Typography variant="body1" ml={6}>
                {commentCount}
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default InstitutionCard
