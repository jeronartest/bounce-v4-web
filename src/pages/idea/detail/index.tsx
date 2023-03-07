import { Avatar, Box, Container, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'
import ReactCopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import styles from './styles'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import { getLabel, getPrimaryRoleLabel } from 'utils'
import { ReactComponent as EmailSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/email.svg'
import { ReactComponent as TwitterIconSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/twitter.svg'
import { ReactComponent as InstagramIconSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/instagram.svg'
import { ReactComponent as WebsiteSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/website.svg'
import { ReactComponent as LinkedinSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/linkedin.svg'
import { ReactComponent as GithubSVG } from 'bounceComponents/profile/components/PersonalOverview/assets/github.svg'
import { ReactComponent as ShareSVG } from 'assets/imgs/profile/share.svg'

import ResumeUploadItem from 'bounceComponents/profile/ResumeFiles/ResumeUploadItem'
import Comments from 'bounceComponents/common/Comments'
import { IIdeaDetail, LIKE_OBJ, LIKE_STATUS, UNLIKE_STATUS } from 'api/idea/type'
import { getIdeaDetail } from 'api/idea'
import { getUserInfo } from 'api/user'
import { TopicType, USER_TYPE } from 'api/user/type'
import { getCompanyInfo } from 'api/company'
import LikeUnlike from 'bounceComponents/common/LikeUnlike'
import ProjectCardSvg from 'bounceComponents/common/ProjectCardSvg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { useUserInfo } from 'state/users/hooks'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useQueryParams } from 'hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

countries.registerLocale(english)

const UserSkeleton: React.FC = () => {
  return (
    <Paper elevation={0} sx={styles.profilePaper}>
      <Stack direction={'row'} justifyContent="space-between">
        <Stack direction={'row'} spacing={16}>
          <Skeleton variant="circular" width={120} height={120} />
          <Stack spacing={8}>
            <Skeleton variant="rounded" width={150} height={32} />
            <Skeleton variant="rounded" width={76} height={32} />
            <Skeleton variant="rounded" width={652} height={32} />
          </Stack>
        </Stack>

        <Stack direction={'row'} sx={styles.linkBox} spacing={9}>
          {[0, 1, 2]?.map(item => {
            return <Skeleton key={item} variant="circular" width={36} height={36} />
          })}
        </Stack>
      </Stack>
    </Paper>
  )
}

const IdeaSkeleton: React.FC = () => {
  return (
    <Paper elevation={0} sx={styles.rootPaper}>
      <Stack
        direction={'row'}
        justifyContent="space-between"
        spacing={170}
        sx={{ p: '52px 48px 40px', borderBottom: '1px solid rgba(23, 23, 23, 0.1)' }}
      >
        <Box>
          <Stack direction={'row'} alignItems="center" spacing={30}>
            <Typography variant="h1" sx={styles.startUp}>
              Startup Idea
            </Typography>
            <Skeleton variant="rounded" width={80} height={24} />
          </Stack>
          <Skeleton variant="rounded" width={297} height={38} sx={{ mt: 16 }} />
          <Skeleton variant="rounded" width={604} height={18} sx={{ mt: 16 }} />
        </Box>
        <Skeleton variant="circular" width={60} height={60} />
      </Stack>
      <Box sx={{ p: '40px 48px 48px' }}>
        <Stack direction={'row'} justifyContent="space-between" spacing={80}>
          <Stack width={875} spacing={24}>
            {[0, 1, 2].map(item => {
              return <Skeleton key={item} variant="rounded" width="100%" height={18} />
            })}
            <Skeleton variant="rounded" width="50%" height={18} />
          </Stack>
          <Stack direction="row" spacing={8}>
            <Skeleton variant="rounded" width={72} height={32} />
            <Skeleton variant="rounded" width={72} height={32} />
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}

const IdeaDetail: React.FC = () => {
  const { token, userId } = useUserInfo()
  const optionDatas = useOptionDatas()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [userLoading, setUserLoading] = useState<boolean>(false)
  const [ideaLoading, setIdeaLoading] = useState<boolean>(false)

  const { id: ideaId } = useQueryParams()
  const [ideaDetail, setIdeaDetail] = useState<IIdeaDetail | null>(null)
  const navigate = useNavigate()

  const getDetail = useCallback(async () => {
    const res = await getIdeaDetail({ ideaId: Number(ideaId) })
    setIdeaDetail(res?.data)
    setIdeaLoading(false)
  }, [ideaId])

  useEffect(() => {
    if (ideaId) {
      setUserLoading(true)
      setIdeaLoading(true)
      getDetail()
    }
  }, [ideaId, getDetail])

  useEffect(() => {
    const getInfo = async () => {
      const res =
        ideaDetail?.userType === USER_TYPE.USER
          ? await getUserInfo({ userId: ideaDetail?.userId || 0 })
          : await getCompanyInfo({ thirdpartId: 0, userId: ideaDetail?.userId })
      setUserInfo(res.data)
      setUserLoading(false)
    }
    if (ideaDetail?.userId) {
      getInfo()
    }
  }, [ideaDetail?.userId, ideaDetail?.userType, userId])

  const linkIcon = useMemo(
    () => [
      {
        link: token ? userInfo?.contactEmail : '',
        isMail: true,
        icon: <EmailSVG />
      },
      {
        link: userInfo?.twitter,
        isMail: false,
        icon: <TwitterIconSVG />
      },
      {
        link: userInfo?.instagram,
        isMail: false,
        icon: <InstagramIconSVG />
      },
      {
        link: userInfo?.website,
        isMail: false,
        icon: <WebsiteSVG />
      },
      {
        link: userInfo?.linkedin,
        isMail: false,
        icon: <LinkedinSVG />
      },
      {
        link: userInfo?.github,
        isMail: false,
        icon: <GithubSVG />
      }
    ],
    [userInfo, token]
  )

  const goToProfile = () => {
    if (ideaDetail?.userId) {
      if (ideaDetail?.userType === USER_TYPE.USER) {
        return navigate(`${routes.profile.summary}?id=${ideaDetail?.userId}`)
      } else {
        return navigate(`${routes.company.summary}?id=${ideaDetail?.userId}`)
      }
    }
  }

  return (
    <section>
      <Container maxWidth="lg">
        {ideaLoading ? (
          <IdeaSkeleton />
        ) : (
          <Paper elevation={0} sx={styles.rootPaper}>
            <Stack
              direction={'row'}
              justifyContent="space-between"
              spacing={170}
              sx={{ p: '52px 48px 40px', borderBottom: '1px solid rgba(23, 23, 23, 0.1)' }}
            >
              <Box>
                <Stack direction={'row'} alignItems="center" spacing={30}>
                  <Typography variant="h1" sx={styles.startUp}>
                    Startup Idea
                  </Typography>
                  <Box>{ideaDetail?.marketType && <ProjectCardSvg status={ideaDetail?.marketType} />}</Box>
                </Stack>
                <Typography variant="h1" sx={styles.ideaTitle}>
                  {ideaDetail?.title}
                </Typography>
                <Typography variant="body1" mt={16} sx={{ color: 'var(--ps-gray-900)' }}>
                  {ideaDetail?.summary}
                </Typography>
              </Box>
              {ideaDetail?.id && (
                <ReactCopyToClipboard text={window.location.href} onCopy={() => toast.success('copy success')}>
                  <IconButton sx={{ border: '1px solid rgba(0, 0, 0, 0.27)', height: 60, width: 60 }}>
                    <ShareSVG />
                  </IconButton>
                </ReactCopyToClipboard>
              )}
            </Stack>
            <Box sx={{ p: '40px 48px 48px' }}>
              <Stack direction={'row'} justifyContent="space-between" spacing={80}>
                <Typography
                  variant="body1"
                  color="#383838"
                  sx={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{
                    __html: ideaDetail?.detail || ''
                  }}
                ></Typography>
                {ideaDetail && (
                  <LikeUnlike
                    likeObj={LIKE_OBJ.idea}
                    objId={ideaDetail?.id}
                    likeAmount={{
                      dislikeCount: ideaDetail?.dislikeCount,
                      likeCount: ideaDetail?.likeCount,
                      myDislike: ideaDetail?.myDislike,
                      myLike: ideaDetail?.myLike
                    }}
                    onSuccess={getDetail}
                    likeSx={{
                      ...styles.like,
                      ...(ideaDetail?.myLike === LIKE_STATUS.yes ? styles.activeLike : '')
                    }}
                    unlikeSx={{
                      ...styles.like,
                      ...(ideaDetail?.myDislike === UNLIKE_STATUS.yes ? styles.activeLike : '')
                    }}
                  />
                )}
              </Stack>
              {ideaDetail && ideaDetail?.posts?.length > 0 && (
                <Box sx={styles.files}>
                  <Typography variant="h2" sx={{ fontSize: 24, lineHeight: '32px' }}>
                    Downloads
                  </Typography>
                  <Stack direction={'row'} spacing={19} sx={{ mt: 32 }}>
                    {ideaDetail?.posts?.map(file => {
                      return <ResumeUploadItem key={file.fileUrl} value={file} />
                    })}
                  </Stack>
                </Box>
              )}
            </Box>
          </Paper>
        )}
        {userLoading ? (
          <UserSkeleton />
        ) : (
          <Paper elevation={0} sx={styles.profilePaper}>
            <Stack direction={'row'} justifyContent="space-between">
              <Stack direction={'row'} spacing={16}>
                <Avatar
                  src={userInfo?.avatar?.fileUrl || DefaultAvatarSVG}
                  sx={{ width: 120, height: 120, borderRadius: '50%', cursor: 'pointer' }}
                  onClick={goToProfile}
                />
                <Box>
                  <Stack direction={'row'} alignItems="center" spacing={8}>
                    <Typography
                      variant="h2"
                      sx={{
                        lineHeight: '32px',
                        color: 'var(--ps-blue)',
                        cursor: 'pointer',
                        '&: hover': { textDecoration: 'underline' }
                      }}
                      onClick={goToProfile}
                    >
                      {userInfo?.fullName || userInfo?.companyName}
                    </Typography>
                    <VerifiedIcon isVerify={userInfo?.isVerify} />
                  </Stack>
                  <Stack direction={'row'} alignItems="center" spacing={4} mt={8} sx={styles.degree}>
                    {!!userInfo?.primaryRole && (
                      <Typography variant="body1">
                        {getPrimaryRoleLabel(userInfo?.primaryRole, optionDatas?.primaryRoleOpt)}
                      </Typography>
                    )}
                    {!!userInfo?.companyState && (
                      <Typography variant="body1">
                        {getLabel(userInfo?.companyState, 'state', optionDatas?.companyStateOpt)}
                      </Typography>
                    )}
                    {userInfo?.location && (
                      <Typography variant="body1">{countries.getName(userInfo?.location, 'en')}</Typography>
                    )}
                  </Stack>
                  <Typography
                    variant="body1"
                    color="var(--ps-gray-700)"
                    mt={12}
                    sx={{ maxWidth: 652, whiteSpace: 'pre-wrap' }}
                  >
                    {userInfo?.description || userInfo?.briefIntro || 'No description yet'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction={'row'} sx={styles.linkBox} spacing={9}>
                {linkIcon?.map((item, index) => {
                  return (
                    <Box key={index} sx={{ display: item.link ? 'block' : 'none' }}>
                      {item.link && (
                        <a target={'_blank'} href={item.isMail ? `mailto:${item.link}` : item.link} rel="noreferrer">
                          <IconButton>{item.icon}</IconButton>
                        </a>
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Stack>
          </Paper>
        )}

        <Paper elevation={0} sx={styles.comments}>
          <Comments topicId={Number(ideaId)} topicType={TopicType.Idea} />
        </Paper>
      </Container>
    </section>
  )
}

export default IdeaDetail
