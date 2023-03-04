import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'

import { Box, Container, Stack, Typography, IconButton, Button, Skeleton } from '@mui/material'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactCopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import Head from 'next/head'
import styles from './styles'
import { IProfileUserInfo, FollowListType } from '@/api/user/type'
import { ITabsListProps } from '@/components/profile/ProfileLayout'
import ProfileAvatar from '@/components/profile/ProfileAvatar'
import { RootState } from '@/store'
import { ReactComponent as QRCodeSVG } from '@/assets/imgs/profile/qr-code.svg'
import { ReactComponent as ShareSVG } from '@/assets/imgs/profile/share.svg'
import { ReactComponent as EditIcon } from '@/assets/imgs/profile/bg-edit.svg'
import { ReactComponent as DeleteIcon } from '@/assets/imgs/profile/bg-delete.svg'
import { ReactComponent as UploadIcon } from '@/assets/imgs/profile/bg-upload.svg'
import CropImg from '@/components/common/DialogCropImg'
import DialogFollowList, { FollowerItem } from '@/components/common/DialogFollowList'

import { getLabel } from '@/utils'
import { getUserInfo, getUserFollowedCount, getUserFollow, getUserFollowUser } from '@/api/user'
// import Tooltip from '@/components/common/Tooltip'
import VerifiedIcon from '@/components/common/VerifiedIcon'

interface IProfileOverviewLayout {
  children?: React.ReactNode
  extraLink?: React.ReactNode
}
const ProfileOverviewLayout: React.FC<IProfileOverviewLayout> = ({ children, extraLink }) => {
  const [personalInfo, setPersonalInfo] = useState<IProfileUserInfo>()
  const [fansCount, setFansCount] = useState<number>(0)
  const [followCount, setFollowCount] = useState<number>(0)
  const [openFollow, setOpenFollow] = useState<boolean>(false)
  const [followersData, setFollowersData] = useState<Array<FollowerItem>>([])
  const [followingData, setFollowingData] = useState<Array<FollowerItem>>([])
  const { userInfo, userId } = useSelector((state: RootState) => state.user)
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const [tabIndex, setTabIndex] = useState<number>(0) // tabIndex 0 following-list 1 followers-list
  const router = useRouter()
  const [isFolloing, setIsFollowing] = useState<boolean>(false)
  const { id } = router.query
  const [showBgEditBtn, setShowBgEditBtn] = useState(false)
  const [showBgEditDialog, setShowBgEditDialog] = useState(false)
  const [showBgEditCropDialog, setShowBgEditCropDialog] = useState(false)
  const [profileBg, setProfileBg] = useState('/imgs/profile/banner1.png')
  const token = useSelector((state: RootState) => state.user.token)
  const isLoginUser = useMemo(() => {
    return Number(userId) === Number(id)
  }, [userId, id])
  const showMouse = () => {
    // isLoginUser && setShowBgEditBtn(false)
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
      const res = await getUserInfo({ userId: Number(id) })
      setPersonalInfo(res.data)
      setProfileBg(res?.data?.banner || '/imgs/profile/banner1.png')
    }
    if (!id || Number(id) === Number(userId)) {
      setPersonalInfo(userInfo)
      setProfileBg(userInfo?.banner || '/imgs/profile/banner1.png')
    } else {
      getInfo()
    }
  }, [id, isLoginUser, userId, userInfo])

  const refreshCount = useCallback(async () => {
    const params = { userId }
    id && (params.userId = Number(id))
    for (const key in params) {
      if (!params[key]) {
        delete params[key]
      }
    }
    const res = await getUserFollowedCount(params)
    const { fanCount, followingCount, following } = res.data
    setFansCount(fanCount || 0)
    setFollowCount(followingCount || 0)
    setIsFollowing(following)
  }, [id, userId])
  const handleClose = useCallback(async () => {
    setOpenFollow(false)
    refreshCount()
  }, [refreshCount])
  useEffect(() => {
    id && handleClose()
  }, [handleClose, id])
  const tabsList: ITabsListProps[] = useMemo(
    () => [
      {
        labelKey: 'summary',
        label: 'Summary',
        href: '/profile/summary'
      },
      {
        labelKey: 'portfolio',
        label: 'Portfolio',
        href: '/profile/portfolio'
      },
      {
        labelKey: 'activities',
        label: 'Activities',
        href: '/profile/activities'
      }
    ],
    []
  )
  const hasActive = (path: string) => {
    return router.asPath.indexOf(path) > -1
  }
  const copyShare = () => {
    const baseUrl = process.env.REACT_APP_SHARE_BASEURL
    return baseUrl + `/profile/summary?id=${router?.query?.id || userId}`

    // if (router.asPath?.indexOf('id') > -1) {
    //   return baseUrl + `/profile/summary?id=${router?.query?.id}`
    // }
    // if (router.asPath?.indexOf('?') > -1) {
    //   return baseUrl + router.asPath + `&id=${userId}`
    // }
    // return baseUrl + router.asPath + `?id=${userId}`
  }

  const followUser = useCallback(async () => {
    if (!token) {
      toast.error('Please login first')
      return
    }
    const isSelected = !isFolloing
    const res = await getUserFollowUser({ userId: Number(id), following: isSelected })
    if (res.data.success) {
      setIsFollowing(isSelected)
      toast.success('Successful operation')
      handleClose()
    }
  }, [handleClose, id, isFolloing, token])
  const openDialog = async (type: FollowListType) => {
    if (isLoginUser) {
      const res2 = await getUserFollow({ userId: Number(userId), followListType: FollowListType.following })
      const result2 = res2.data.list
      setFollowingData(result2 || [])
      const res1 = await getUserFollow({ userId: Number(userId), followListType: FollowListType.follower })
      const list = res1.data.list
      setFollowersData(list)
    } else {
      const res1 = await getUserFollow({
        userId: Number(id) || 0,
        thirdpartId: 0,
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
    <>
      <Head>
        <title>Profile | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
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
            <Stack direction="row" sx={{ padding: '40px 48px 0px 36px', minHeight: 138 }}>
              <Box sx={{ position: 'relative', width: '192px' }}>
                {!personalInfo?.avatar ? (
                  <Skeleton
                    variant="circular"
                    width={180}
                    height={180}
                    sx={{ position: 'absolute', top: '-80px', background: 'var(--ps-gray-50)' }}
                  />
                ) : (
                  <ProfileAvatar src={personalInfo?.avatar?.fileThumbnailUrl || personalInfo?.avatar?.fileUrl} />
                )}
                <VerifiedIcon
                  isVerify={personalInfo?.isVerify}
                  width={42}
                  height={42}
                  showVerify={personalInfo?.id === userId}
                  sx={{ position: 'absolute', right: -28, bottom: 0 }}
                />
              </Box>
              <Box sx={{ width: '100%', ml: 48 }}>
                <Stack direction={'row'} justifyContent="space-between" alignItems={'center'}>
                  {!personalInfo?.fullName && !personalInfo?.fullNameId ? (
                    <Skeleton variant="rectangular" width={280} height={46} sx={{ background: 'var(--ps-gray-50)' }} />
                  ) : (
                    <Stack direction={'row'} alignItems="center">
                      <Typography variant="h1">{personalInfo?.fullName}</Typography>
                      <Typography variant="body1" color="rgba(23, 23, 23, 0.7)" ml={10} sx={{ fontSize: 20 }}>
                        {personalInfo?.fullNameId && `#${personalInfo?.fullNameId}`}
                      </Typography>
                    </Stack>
                  )}
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
                      onClick={() => openDialog(FollowListType.follower)}
                    >
                      <Typography
                        variant="body1"
                        color="var(--ps-gray-900)"
                        sx={{ fontFamily: "'Sharp Grotesk DB Cyr Medium 22'" }}
                      >
                        {fansCount} Followers
                      </Typography>
                    </Button>
                    {Number(id) === Number(userId) && (
                      <Button
                        variant="outlined"
                        sx={{ height: 40, borderRadius: 20, border: '1px solid #D4D4D4', padding: '10px 14px' }}
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
                  </Stack>
                </Stack>

                <Stack direction={'row'} alignItems="center" spacing={12} mt={16}>
                  {personalInfo?.publicRole?.map(item => {
                    const label = getLabel(item, 'role', optionDatas?.publicRoleOpt)
                    return (
                      <Box key={item} sx={{ padding: '7px 12px', background: 'var(--ps-gray-50)', borderRadius: 16 }}>
                        {label}
                      </Box>
                    )
                  })}
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
                      sx={{ ...styles.menu, ...(hasActive(item.href) ? styles.menuActive : ({} as any)) }}
                    >
                      <Link
                        href={`${item.href}${
                          router?.asPath?.split('?')?.[1] ? '?' + router?.asPath?.split('?')?.[1] : ''
                        }`}
                        legacyBehavior
                      >
                        {item.label}
                      </Link>
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
          userId={userId}
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
    </>
  )
}

export default ProfileOverviewLayout
