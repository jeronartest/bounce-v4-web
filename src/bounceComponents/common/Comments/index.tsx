import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import moment, { unix } from 'moment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import FormItem from '../FormItem'
import VerifiedIcon from '../VerifiedIcon'
import styles from './styles'
import { RootState } from '@/store'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import { ReactComponent as DeleteSVG } from 'bounceComponents/profile/ResumeFiles/assets/delete.svg'
import {
  useAddComments,
  useAddCommentsReply,
  useDeleteComments,
  useDeleteCommentsReply,
  useGetComments
} from 'bounceHooks/user/useComments'
import { ICommentsItem, TopicType, USER_TYPE } from 'api/user/type'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import { VerifyStatus } from 'api/profile/type'

interface ICommentDetail {
  avatar: string
  name: string
  userId: number
  createdAt: number
  content: string
  commentId?: number
  userType?: USER_TYPE
  isVerify: VerifyStatus
}
interface ICommentItemProps {
  item: ICommentDetail
  onRefresh: () => void
  commentId?: number
  commentReplyId?: number
}

const CommentItem: React.FC<ICommentItemProps> = ({ item, onRefresh, commentId, commentReplyId }) => {
  const { userId } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const { run: runDeleteComments } = useDeleteComments(onRefresh)
  const { run: runDeleteCommentsReply } = useDeleteCommentsReply(onRefresh)
  const handleDelete = () => {
    if (commentId) {
      return runDeleteComments({ commentId })
    }
    if (commentReplyId) {
      return runDeleteCommentsReply({ commentReplyId })
    }
  }
  const handleLink = () => {
    if (item?.userType === USER_TYPE.USER) {
      return router.push(`/profile/summary?id=${item?.userId}`)
    }
    return router.push(`/company/summary?id=${item?.userId}`)
  }
  return (
    <Box>
      <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
        <Stack direction={'row'} spacing={8}>
          <Avatar
            src={item?.avatar || DefaultAvatarSVG}
            sx={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
            onClick={handleLink}
          />
          <Box>
            <Stack direction={'row'} alignItems="center" spacing={8}>
              <Typography
                variant="h5"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={handleLink}
              >
                {item?.name}
              </Typography>
              <VerifiedIcon isVerify={item?.isVerify} />
            </Stack>
            <Typography variant="body2" color="var(--ps-gray-700)">
              {moment(Date.now()).diff(unix(item.createdAt), 'months', true) > 1
                ? unix(item.createdAt).format('D MMM, YYYY')
                : unix(item.createdAt).fromNow()}
            </Typography>
          </Box>
        </Stack>
        {item?.userId === userId && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 16, cursor: 'pointer' }} onClick={handleDelete}>
            <Typography variant="body1" sx={{ mr: 4 }}>
              Delete
            </Typography>
            <DeleteSVG />
          </Box>
        )}
      </Stack>

      <Typography variant="body1" mt={12} sx={{ maxWidth: 965 }}>
        {item.content}
      </Typography>
    </Box>
  )
}

interface ICommentItemGroupProps {
  item: ICommentsItem
  onRefresh: () => void
  expanded: number | false
  setExpanded: (val: number | false) => void
}

const CommentItemGroup: React.FC<ICommentItemGroupProps> = ({ item, onRefresh, expanded, setExpanded }) => {
  const router = useRouter()
  const { token, userInfo, companyInfo, userType } = useSelector((state: RootState) => state.user)
  const [replyComment, setReplyComment] = useState<string>('')
  const [clickedReply, setClickedReply] = useState<boolean>(false)
  const { run: runAddCommentsReply } = useAddCommentsReply(onRefresh)

  const initialValues = {
    content: ''
  }
  const handleComment = (values, { resetForm }) => {
    if (!token) return router.push(`/login?path=${location.pathname}${location.search}`)
    const { content } = values
    runAddCommentsReply({ commentId: item?.commentId, content })
    resetForm()
  }
  const handleChange = (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Box mt={20}>
      <CommentItem item={item} onRefresh={onRefresh} commentId={item?.commentId} />
      {item.replies && (
        <Accordion sx={styles.accord} expanded={expanded === item?.commentId} onChange={handleChange(item?.commentId)}>
          <Stack direction={'row'} alignItems="center">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={styles.accordSummary}>
              <Typography variant="body2">Replies ({item?.replies?.length})</Typography>
            </AccordionSummary>
            <Button
              sx={{ color: 'var(--ps-blue)', height: 24, background: 'none' }}
              onClick={() => {
                setClickedReply(true)
                setExpanded(item?.commentId)
              }}
            >
              Reply
            </Button>
          </Stack>

          <AccordionDetails sx={styles.accordDetail}>
            {clickedReply && (
              <Formik initialValues={initialValues} onSubmit={handleComment}>
                {({ values }) => {
                  return (
                    <Stack component={Form} direction={'row'} spacing={8} mt={20} ml={20}>
                      <Avatar
                        src={
                          userType === USER_TYPE.USER
                            ? userInfo?.avatar?.fileUrl || DefaultAvatarSVG
                            : userType === USER_TYPE.COMPANY || userType === USER_TYPE.INVESTOR
                            ? companyInfo?.avatar?.fileUrl || DefaultAvatarSVG
                            : DefaultAvatarSVG
                        }
                        sx={{ width: 40, height: 40, borderRadius: '50%' }}
                      />
                      <FormItem name="content" sx={{ width: '100%' }}>
                        <OutlinedInput
                          fullWidth
                          placeholder="Join the discussion"
                          value={replyComment}
                          onChange={e => setReplyComment(e.target.value)}
                        />
                      </FormItem>
                      <Button type="submit" variant="contained" sx={{ width: 140 }} disabled={!values.content.trim()}>
                        Send
                      </Button>
                    </Stack>
                  )
                }}
              </Formik>
            )}
            <Stack spacing={20}>
              {item?.replies?.map((v, k) => {
                return (
                  <Box sx={{ mt: 20 }} key={`${v.commentId}+${k}`}>
                    <CommentItem item={v} onRefresh={onRefresh} commentReplyId={v.commentReplyId} />
                  </Box>
                )
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  )
}

interface ICommentsProps {
  topicId: number
  topicType: TopicType
}
const Comments: React.FC<ICommentsProps> = ({ topicId, topicType }) => {
  const router = useRouter()
  const [expanded, setExpanded] = useState<number | false>(false)
  const { token } = useSelector((state: RootState) => state.user)
  const initialValues = {
    content: ''
  }
  const { data: commentsData, refresh: runGetComments } = useGetComments(topicId, topicType)
  const { run: runAddComments } = useAddComments(runGetComments)
  const handleComment = (values, { resetForm }) => {
    if (!token) {
      toast.error('Please login')
      router.push(`/login?path=${location.pathname}${location.search}`)
    }
    const { content } = values
    runAddComments({ content, topicId, topicType })
    resetForm()
  }

  return (
    <Box>
      <Typography variant="h2" sx={styles.commentTitle}>
        Comments ({commentsData?.total || 0})
      </Typography>
      <Formik initialValues={initialValues} onSubmit={handleComment}>
        {({ values }) => {
          return (
            <Stack component={Form} mt={32} noValidate>
              <Stack direction={'row'} justifyContent="space-between" spacing={12}>
                <FormItem name="content" sx={{ width: '100%' }}>
                  <OutlinedInput fullWidth placeholder="Join the discussion" />
                </FormItem>
                <Button variant="contained" sx={{ width: 140 }} type="submit" disabled={!values.content.trim()}>
                  Send
                </Button>
              </Stack>
            </Stack>
          )
        }}
      </Formik>
      {commentsData?.total > 0 && (
        <>
          <Typography variant="h2" sx={{ fontSize: 20, lineHeight: '26px', mt: 40 }}>
            All comments
          </Typography>
          <Box>
            {commentsData?.list?.map((item: ICommentsItem, index) => {
              return (
                <CommentItemGroup
                  key={`${item?.commentId}_${index}`}
                  item={item}
                  onRefresh={runGetComments}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              )
            })}
          </Box>
        </>
      )}
    </Box>
  )
}

export default Comments
