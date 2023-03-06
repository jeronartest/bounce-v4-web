import { Box, Container, Stack, Typography, IconButton, Button, Skeleton } from '@mui/material'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import ReactCopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import styles from './styles'
import { ITabsListProps } from 'bounceComponents/profile/ProfileLayout'
import ProfileAvatar from 'bounceComponents/profile/ProfileAvatar'
import { ReactComponent as QRCodeSVG } from 'assets/imgs/profile/qr-code.svg'
import { ReactComponent as ShareSVG } from 'assets/imgs/profile/share.svg'
import { getLabel } from 'utils'
import { ICompanyOverviewInfo } from 'api/company/type'
import { getCompanyInfo } from 'api/company'
import { USER_TYPE, FollowListType } from 'api/user/type'
import LikeUnlike from 'bounceComponents/common/LikeUnlike'
import { ILikeUnlikeRes, LIKE_OBJ, LIKE_STATUS, UNLIKE_STATUS } from 'api/idea/type'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { getUserFollowedCount, getUserFollow, getUserFollowUser } from 'api/user'
import { MoreDialog } from 'bounceComponents/common/MoreDialog'
import CropImg from 'bounceComponents/common/DialogCropImg'
import DialogFollowList, { FollowerItem } from 'bounceComponents/common/DialogFollowList'
import { ReactComponent as EditIcon } from 'assets/imgs/profile/bg-edit.svg'
import { ReactComponent as DeleteIcon } from 'assets/imgs/profile/bg-delete.svg'
import { ReactComponent as UploadIcon } from 'assets/imgs/profile/bg-upload.svg'
import { useQueryParams } from 'hooks/useQueryParams'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'
import { useOptionDatas } from 'state/configOptions/hooks'
import { routes } from 'constants/routes'
interface ICompanyOverviewLayout {
  children?: React.ReactNode
  extraLink?: React.ReactNode
}
const CompanyOverviewLayout: React.FC<ICompanyOverviewLayout> = ({ children, extraLink }) => {
  const { companyInfo: initCompanyInfo, userId, token } = useUserInfo()
  const optionDatas = useOptionDatas()
  const { id, thirdpartId } = useQueryParams()
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const [companyInfo, setCompanyInfo] = useState<ICompanyOverviewInfo>()
  const [likeObject, setLikeObject] = useState<ILikeUnlikeRes>()
  const [fansCount, setFansCount] = useState<number>(0)
  const [followCount, setFollowCount] = useState<number>(0)
  const [openFollow, setOpenFollow] = useState<boolean>(false)
  const [followersData, setFollowersData] = useState<Array<FollowerItem>>([])
  const [followingData, setFollowingData] = useState<Array<FollowerItem>>([])
  const [isFolloing, setIsFollowing] = useState<boolean>(false)
  const [tabIndex, setTabIndex] = useState<FollowListType>(FollowListType.follower) // tabIndex 0 following-list 1 followers-list
  const [showBgEditBtn, setShowBgEditBtn] = useState(false)
  const [showBgEditDialog, setShowBgEditDialog] = useState(false)
  const [showBgEditCropDialog, setShowBgEditCropDialog] = useState(false)
  const [profileBg, setProfileBg] = useState('/imgs/profile/banner1.png')

  useEffect(() => {
    setLikeObject({
      dislikeCount: companyInfo?.dislikeCount || 0,
      likeCount: companyInfo?.likeCount || 0,
      myDislike: companyInfo?.myDislike || 0,
      myLike: companyInfo?.myLike || 0
    })
  }, [companyInfo])
  const tabsList: ITabsListProps[] = useMemo(
    () => [
      {
        labelKey: 'summary',
        label: 'Summary',
        href: '/company/summary'
      },
      {
        labelKey: 'team',
        label: 'Team',
        href: '/company/team'
      },
      {
        labelKey: 'funding',
        label: 'Funding',
        href: '/company/funding'
      },
      // {
      //   labelKey: 'jobs',
      //   label: 'Jobs',
      //   href: '/company/jobs',
      // },
      {
        labelKey: 'activities',
        label: 'Activities',
        href: '/company/activities'
      },
      {
        labelKey: 'comments',
        label: 'Comments',
        href: '/company/comments'
      }
    ],
    []
  )
  const hasActive = (path: string) => {
    return path.indexOf(pathname) > -1
  }
  const linkHref = (href: string) => {
    return navigate(href + search)
  }
  const copyShare = () => {
    const baseUrl = process.env.REACT_APP_SHARE_BASEURL
    // if (router.asPath?.indexOf('id') > -1) {
    //   return baseUrl + `/company/summary?id=${router.query?.id}`
    // }
    if (router.asPath?.indexOf('thirdpartId') > -1) {
      return baseUrl + `${routes.company.summary}?thirdpartId=${thirdpartId}`
    }
    return baseUrl + `${routes.company.summary}?id=${id || userId}`
    // if (router.asPath?.indexOf('?') > -1) {
    //   return baseUrl + router.asPath + `&id=${userId}`
    // }
    // return baseUrl + router.asPath + `?id=${userId}`
  }
  const isLoginUser = useMemo(() => {
    return Number(userId) === Number(id)
  }, [userId, id])
  const showMouse = () => {
    isLoginUser && setShowBgEditBtn(true)
  }
  const hideMouse = () => {
    setShowBgEditBtn(false)
    setShowBgEditDialog(false)
  }
  const deleteBgImg = () => {
    setProfileBg('/imgs/profile/banner1.png')
    hideMouse()
  }
  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfo({
        thirdpartId: thirdpartId ? Number(thirdpartId) : undefined,
        userId: id ? Number(id) : undefined
      })
      setCompanyInfo(res.data)
      setProfileBg(res?.data?.banner || '/imgs/profile/banner1.png')
    }
    if ((!id && !thirdpartId) || Number(id) === Number(userId)) {
      setCompanyInfo(initCompanyInfo)
      setProfileBg(initCompanyInfo?.banner || '/imgs/profile/banner1.png')
    } else {
      getInfo()
    }
  }, [id, isLoginUser, userId, initCompanyInfo, thirdpartId])
  const refreshCount = useCallback(async () => {
    const params = { thirdpartId: 0, userId: 0 }
    thirdpartId && (params.thirdpartId = Number(thirdpartId))
    id && (params.userId = Number(id))
    for (const key in params) {
      if (typeof key === 'number' && !params[key]) {
        delete params[key]
      }
    }
    const res = await getUserFollowedCount(params)
    const { fanCount, followingCount, following } = res.data
    setFansCount(fanCount || 0)
    setFollowCount(followingCount || 0)
    setIsFollowing(following)
  }, [id, thirdpartId])
  const handleClose = useCallback(async () => {
    setOpenFollow(false)
    refreshCount()
  }, [refreshCount])
  useEffect(() => {
    ;(id || thirdpartId) && handleClose()
  }, [handleClose, id, thirdpartId])
  const followUser = useCallback(async () => {
    if (!token) {
      toast.error('Please login first')
      return
    }
    const isSelected = !isFolloing
    const res = await getUserFollowUser({ userId: Number(id), thirdpartId: Number(thirdpartId), following: isSelected })
    if (res.data.success) {
      setIsFollowing(isSelected)
      toast.success('Successful operation')
      handleClose()
    }
  }, [handleClose, id, isFolloing, thirdpartId, token])
  const openDialog = async (type: FollowListType) => {
    if (isLoginUser) {
      const res2 = await getUserFollow({ userId: Number(userId), followListType: FollowListType.following })
      const result2 = res2.data.list
      setFollowingData(result2 || [])
      const res1 = await getUserFollow({ userId: Number(userId), followListType: FollowListType.follower })
      const list = res1.data.list
      setFollowersData(list || [])
    } else {
      const res1 = await getUserFollow({
        userId: Number(id) || 0,
        thirdpartId: Number(thirdpartId) || 0,
        followListType: FollowListType.follower
      })
      setFollowersData(res1.data.list)
    }
    if (type === FollowListType.follower) {
      setTabIndex(FollowListType.follower)
    } else {
      setTabIndex(FollowListType.following)
    }
    setOpenFollow(true)
  }

  return (
    <section>
      <Container maxWidth="xl" sx={{ position: 'relative', mb: 80 }}>
        <Box sx={{ height: 448 }}>
          <picture
            style={{ width: '100%', height: '100%', cursor: isLoginUser ? 'pointer' : 'normal' }}
            onMouseEnter={showMouse}
            onMouseLeave={hideMouse}
          >
            <img src={profileBg} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </picture>
        </Box>
        <Box sx={{ position: 'relative', marginTop: -200, width: '100%' }}>
          <Container maxWidth="lg" sx={styles.contain}>
            {showBgEditBtn && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '-52px',
                  right: 0,
                  zIndex: 2
                }}
                onMouseEnter={showMouse}
              >
                <Box
                  sx={{
                    borderRadius: '22px',
                    background: '#171717',
                    height: '40px',
                    lineHeight: '40px',
                    padding: '0 20px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  mb={'5px'}
                  onClick={() => setShowBgEditDialog(true)}
                >
                  <EditIcon
                    style={{
                      verticalAlign: 'middle',
                      marginRight: '11px'
                    }}
                  />
                  Edit cover photo
                </Box>
                {showBgEditDialog && (
                  <Box
                    sx={{
                      borderRadius: '20px',
                      background: '#fff',
                      boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.1)`,
                      padding: '10px 0',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                    onMouseLeave={() => {
                      setShowBgEditDialog(false)
                    }}
                  >
                    <Box
                      sx={{
                        height: '40px',
                        lineHeight: '40px',
                        color: '#171717',
                        padding: '0 20px',
                        '&:hover': {
                          background: '#f1f1f1'
                        }
                      }}
                      onClick={() => setShowBgEditCropDialog(true)}
                    >
                      <UploadIcon
                        style={{
                          verticalAlign: 'middle',
                          marginRight: '11px'
                        }}
                      />
                      Upload photo
                    </Box>
                    <Box
                      sx={{
                        height: '40px',
                        lineHeight: '40px',
                        color: '#171717',
                        padding: '0 20px',
                        '&:hover': {
                          background: '#f1f1f1'
                        }
                      }}
                      onClick={deleteBgImg}
                    >
                      <DeleteIcon
                        style={{
                          verticalAlign: 'middle',
                          marginRight: '11px'
                        }}
                      />
                      Delete
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            <Stack direction="row" sx={{ padding: '40px 48px 0px 36px' }}>
              <Box sx={{ position: 'relative', width: '192px', height: 136 }}>
                {!companyInfo?.avatar ? (
                  <Skeleton
                    variant="circular"
                    width={180}
                    height={180}
                    sx={{ position: 'absolute', top: '-80px', background: 'var(--ps-gray-50)' }}
                  />
                ) : (
                  <ProfileAvatar src={companyInfo?.avatar?.fileThumbnailUrl || companyInfo?.avatar?.fileUrl} />
                )}
                <VerifiedIcon
                  isVerify={companyInfo?.isVerify || 1}
                  width={42}
                  height={42}
                  showVerify={companyInfo?.companyId === userId}
                  sx={{ position: 'absolute', right: -28, bottom: 40 }}
                />
              </Box>
              <Box sx={{ width: '100%', ml: 48 }}>
                <Stack direction={'row'} justifyContent="space-between">
                  <Box>
                    {!companyInfo?.companyName ? (
                      <Skeleton
                        variant="rectangular"
                        width={280}
                        height={46}
                        sx={{ background: 'var(--ps-gray-50)' }}
                      />
                    ) : (
                      <Typography variant="h1">{companyInfo?.companyName}</Typography>
                    )}
                  </Box>
                  <Box>
                    <Stack direction={'row'} alignItems="center" justifyContent={'flex-end'} spacing={4}>
                      {!isLoginUser && isFolloing && (
                        <Box sx={styles.followingBtn}>
                          <span className={'following'}>Following</span>
                          <span className={'unfollow'} onClick={followUser}>
                            Unfollow
                          </span>
                        </Box>
                      )}
                      {!isLoginUser && !isFolloing && (
                        <Box sx={styles.unfollowingBtn}>
                          <span className={'following'} onClick={followUser}>
                            Follow
                          </span>
                          <span className={'unfollow'}>Follow</span>
                        </Box>
                      )}
                      <Button
                        variant="outlined"
                        sx={{ height: 40, borderRadius: 20, border: '1px solid #D4D4D4', padding: '10px 14px' }}
                      >
                        <Typography
                          variant="body1"
                          color="var(--ps-gray-900)"
                          sx={{ fontFamily: "'Sharp Grotesk DB Cyr Medium 22'" }}
                          // onClick={() => toast.warn('This feature is not available yet, please try later.')}
                          onClick={() => openDialog(FollowListType.follower)}
                        >
                          {fansCount} Followers
                        </Typography>
                      </Button>
                      {isLoginUser && (
                        <Button
                          variant="outlined"
                          sx={{ height: 40, borderRadius: 20, border: '1px solid #D4D4D4', padding: '10px 14px' }}
                          // onClick={() => toast.warn('This feature is not available yet, please try later.')}
                          onClick={() => openDialog(FollowListType.following)}
                        >
                          <Typography
                            variant="body1"
                            color="var(--ps-gray-900)"
                            sx={{ fontFamily: "'Sharp Grotesk DB Cyr Medium 22'" }}
                          >
                            {followCount} Following
                          </Typography>
                        </Button>
                      )}
                      <IconButton
                        sx={{ border: '1px solid rgba(0, 0, 0, 0.27)' }}
                        onClick={() => toast.warn('This feature is not available yet, please try later.')}
                      >
                        <QRCodeSVG />
                      </IconButton>
                      <ReactCopyToClipboard text={copyShare()} onCopy={() => toast.success('Successfully copied')}>
                        <IconButton sx={{ border: '1px solid rgba(0, 0, 0, 0.27)' }}>
                          <ShareSVG />
                        </IconButton>
                      </ReactCopyToClipboard>
                      {thirdpartId && <MoreDialog />}
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction={'row'} justifyContent="space-between" sx={{ mt: 10 }}>
                  <Typography variant="body1" sx={{ maxWidth: 576 }}>
                    {companyInfo?.briefIntro}
                  </Typography>
                  {companyInfo?.userType === USER_TYPE.COMPANY && likeObject && (
                    <LikeUnlike
                      likeObj={thirdpartId ? LIKE_OBJ.thirdpartCompany : LIKE_OBJ.company}
                      objId={companyInfo?.companyId}
                      likeAmount={likeObject}
                      onSuccess={res => {
                        setLikeObject(res)
                      }}
                      likeSx={{
                        ...styles.like,
                        ...(likeObject?.myLike === LIKE_STATUS.yes ? styles.activeLike : '')
                      }}
                      unlikeSx={{
                        ...styles.like,
                        ...(likeObject?.myDislike === UNLIKE_STATUS.yes ? styles.activeLike : '')
                      }}
                    />
                  )}
                </Stack>

                <Stack direction={'row'} alignItems="center" spacing={12} mt={16}>
                  {!!companyInfo?.companyState && (
                    <Box
                      sx={{
                        padding: '7px 12px',
                        height: '32px',
                        borderRadius: 16,
                        background: 'var(--ps-gray-50)',
                        width: 'fit-content'
                      }}
                    >
                      {getLabel(companyInfo?.companyState, 'state', optionDatas?.companyStateOpt)}
                    </Box>
                  )}
                  {companyInfo?.userType === USER_TYPE.INVESTOR && (
                    <Box
                      sx={{
                        padding: '7px 12px',
                        height: '32px',
                        borderRadius: 16,
                        background: 'var(--ps-gray-50)',
                        width: 'fit-content'
                      }}
                    >
                      Institution investor
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
            <Stack direction={'row'} justifyContent="space-between" sx={styles.tabsBox}>
              <Stack direction="row" spacing={36} alignItems="center">
                {tabsList?.map(item => {
                  return (
                    <Typography
                      variant="h4"
                      key={item.labelKey}
                      sx={{ ...styles.menu, ...(hasActive(item?.href || '') ? styles.menuActive : ({} as any)) }}
                      onClick={() => linkHref(item?.href || '')}
                    >
                      {item.label}
                    </Typography>
                  )
                })}
              </Stack>
              <div>{extraLink}</div>
            </Stack>
            <Box sx={{ background: '#FFFFFF', borderRadius: 20 }}>{children}</Box>
          </Container>
        </Box>
        {/* following & follower list */}
        <DialogFollowList
          userId={Number(userId)}
          setIsFollowing={setIsFollowing}
          setOpenFollow={setOpenFollow}
          openFollow={openFollow}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setFollowersData={setFollowersData}
          setFollowingData={setFollowingData}
          followersData={followersData}
          followingData={followingData}
          fansCount={fansCount}
          setFansCount={setFansCount}
          followCount={followCount}
          setFollowCount={setFollowCount}
        />
        {/* Crop bg img dialog */}
        <CropImg
          setShowBgEditBtn={setShowBgEditBtn}
          setShowBgEditDialog={setShowBgEditDialog}
          showBgEditCropDialog={showBgEditCropDialog}
          setShowBgEditCropDialog={setShowBgEditCropDialog}
          setProfileBg={setProfileBg}
        />
      </Container>
    </section>
  )
}

export default CompanyOverviewLayout
