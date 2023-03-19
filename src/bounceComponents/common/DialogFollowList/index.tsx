import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { Box, Stack, Typography, Dialog, styled, Avatar } from '@mui/material'

import { toast } from 'react-toastify'
import styles from './styles'
import { VerifyStatus } from 'api/profile/type'
import { USER_TYPE, FollowListType } from 'api/user/type'
import { ReactComponent as CloseIcon } from 'assets/imgs/user/close.svg'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import { getLabelById } from 'utils'
import { getUserFollowedCount, getUserFollow, getUserFollowUser } from 'api/user'
// import Tooltip from 'bounceComponents/common/Tooltip'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'
import { useOptionDatas } from 'state/configOptions/hooks'

import NoData from 'bounceComponents/common/NoData'
import { useQueryParams } from 'hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'
export const DialogStyle = styled(Dialog)(() => ({
  '.MuiDialog-paper': {
    position: 'relative',
    borderRadius: '20px'
  },
  '.cancelBtn': {
    width: '140px',
    height: '60px',
    lineHeight: '60px',
    textAlign: 'center',
    border: `1px solid #171717`,
    borderRadius: `36px`,
    background: '#fff',
    cursor: 'pointer',
    marginRight: '10px'
  },
  '.saveBtn': {
    width: '140px',
    height: '60px',
    textAlign: 'center',
    lineHeight: '60px',
    background: '#171717',
    border: `1px solid #171717`,
    borderRadius: `36px`,
    color: '#fff',
    cursor: 'pointer'
  }
}))
export const TabsStyle = styled(Box)(() => ({
  padding: '52px 40px 0',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  '.item': {
    fontFamily: 'Sharp Grotesk DB Cyr Medium 22',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#171717',
    opacity: 0.5,
    cursor: 'pointer',
    paddingBottom: '12px',
    marginRight: '36px',
    '&:hover': {
      opacity: 1
    }
  },
  '.active': {
    fontFamily: 'Sharp Grotesk DB Cyr Medium 22',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#171717',
    cursor: 'pointer',
    paddingBottom: '12px',
    marginRight: '36px',
    opacity: 1,
    lineHeight: '18px',
    borderBottom: '2px solid #000000'
  }
}))
export interface FollowerItem {
  avatar: string
  companyIntroduction: string
  fullName: string
  fullNameId: number
  publicRole: Array<number>
  loginUserFollowing: boolean
  userId: number
  isVerify?: VerifyStatus
  thirdpartId: number
  userType: USER_TYPE
  isSelected?: boolean
}
interface IProfileOverviewLayout {
  userId?: number
  setIsFollowing?: (data: boolean) => void
  setOpenFollow?: (data: boolean) => void
  openFollow: boolean
  tabIndex: number
  setFollowersData?: (data: Array<FollowerItem>) => void
  setFollowingData?: (data: Array<FollowerItem>) => void
  followersData?: Array<FollowerItem>
  followingData?: Array<FollowerItem>
  setTabIndex?: (data: number) => void
  fansCount: number
  setFansCount?: (data: number) => void
  followCount: number
  setFollowCount?: (data: number) => void
}
const DialogFollowList: React.FC<IProfileOverviewLayout> = ({
  userId,
  setIsFollowing,
  setOpenFollow,
  openFollow,
  tabIndex,
  setTabIndex,
  setFollowersData,
  setFollowingData,
  followersData,
  followingData,
  fansCount,
  setFansCount,
  followCount,
  setFollowCount
}) => {
  const optionDatas = useOptionDatas()
  const { id } = useQueryParams()
  const navigate = useNavigate()
  const { token } = useUserInfo()

  const [loading, setLoading] = useState<boolean>(false)
  const isLoginUser = useMemo(() => {
    return Number(userId) === Number(id)
  }, [userId, id])

  const refreshCount = useCallback(async () => {
    const params = { userId }
    id && (params.userId = Number(id))
    for (const key in params) {
      if (typeof key === 'number' && !params[key]) {
        delete params[key]
      }
    }
    const res = await getUserFollowedCount(params)
    const { fanCount, followingCount, following } = res.data
    setFansCount && setFansCount(fanCount || 0)
    setFollowCount && setFollowCount(followingCount || 0)
    setIsFollowing && setIsFollowing(following)
  }, [id, setFansCount, setFollowCount, setIsFollowing, userId])
  const handleClose = useCallback(async () => {
    setOpenFollow && setOpenFollow(false)
    refreshCount()
  }, [refreshCount, setOpenFollow])
  useEffect(() => {
    id && handleClose()
  }, [handleClose, id])
  const handleChange = async (newValue: FollowListType) => {
    setTabIndex && setTabIndex(newValue)
    if (isLoginUser && newValue === FollowListType.following) {
      const res2 = await getUserFollow({ userId: Number(userId), followListType: FollowListType.following })
      const result2 = res2.data.list
      setFollowingData && setFollowingData(result2 || [])
    }
  }
  const triggerFollowItem = async (item: FollowerItem) => {
    if (!token) {
      toast.error('Please login first!')
      return
    }
    if (loading) {
      return
    }
    setLoading(true)
    const isSelected = !item.loginUserFollowing
    const thirdpartId = Number(item.thirdpartId)
    const userId = Number(item.userId)
    const res = await getUserFollowUser({
      thirdpartId: thirdpartId,
      userId: userId,
      following: isSelected
    })
    if (res.data.success) {
      // tabIndex 0 following-list 1 followers-list
      const resutl1 = followingData.map(j => {
        if ((userId && userId === Number(j.userId)) || (thirdpartId && thirdpartId === Number(j.thirdpartId))) {
          j.loginUserFollowing = isSelected
        }
        return j
      })
      setFollowingData(resutl1)
      const resutl2 = followersData.map(j => {
        if ((userId && userId === Number(j.userId)) || (thirdpartId && thirdpartId === Number(j.thirdpartId))) {
          j.loginUserFollowing = isSelected
        }
        return j
      })
      setFollowersData(resutl2)
      refreshCount()
    }
    setLoading(false)
  }
  const linkTopage = (item: FollowerItem) => {
    const { thirdpartId, userType, userId } = item
    if (thirdpartId) {
      return navigate(`/company/summary?thirdpartId=${thirdpartId}`)
    }
    if (userType === USER_TYPE.USER) {
      return navigate(`/profile/summary?id=${userId}`)
    }
    return navigate(`/company/summary?id=${item?.userId}`)
  }
  const getPublicRoleLable = publicRoleId => {
    return getLabelById(publicRoleId, 'role', optionDatas?.publicRoleOpt)
  }
  return (
    <DialogStyle onClose={handleClose} open={openFollow} fullWidth={true} maxWidth={'md'}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: '#fff',
          zIndex: 2
        }}
      >
        <CloseIcon
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            cursor: 'pointer'
          }}
          onClick={handleClose}
        />
        <TabsStyle>
          <Box
            className={tabIndex === FollowListType.follower ? 'item, active' : 'item'}
            onClick={() => handleChange(FollowListType.follower)}
          >
            {fansCount} Followers
          </Box>
          {isLoginUser && (
            <Box
              className={tabIndex === FollowListType.following ? 'item, active' : 'item'}
              onClick={() => handleChange(FollowListType.following)}
            >
              {followCount} Following
            </Box>
          )}
        </TabsStyle>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            marginTop: '84px',
            width: '100%',
            height: 'calc(100% - 84px)',
            overflowY: 'auto',
            padding: '40px'
          }}
        >
          {tabIndex === FollowListType.follower && followersData.length === 0 && <NoData />}
          {tabIndex === FollowListType.follower &&
            followersData.length > 0 &&
            followersData.map((item, index) => (
              <Box sx={styles.followerItemStyle} key={index}>
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginRight: '10px'
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '52px',
                      height: '52px',
                      marginRight: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Avatar
                      src={item.avatar || DefaultAvatarSVG}
                      sx={{
                        width: '52px',
                        height: '52px'
                      }}
                      onClick={() => linkTopage(item)}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1
                    }}
                  >
                    <Stack direction={'row'} alignItems="center" spacing={8} mb={4}>
                      <Typography variant="body2" className={'name'} onClick={() => linkTopage(item)}>
                        {item.userType === USER_TYPE.USER ? item.fullName + ' # ' + item.fullNameId : item.fullName}
                      </Typography>
                      <VerifiedIcon isVerify={item?.isVerify} />
                    </Stack>
                    <Typography variant="body2" className="description">
                      {item.userType === USER_TYPE.COMPANY ? (
                        item.companyIntroduction || 'Company account'
                      ) : item.userType === USER_TYPE.INVESTOR ? (
                        item.companyIntroduction || 'Institutional investor'
                      ) : (
                        <>
                          {item.publicRole?.length === 0 ? (
                            'Individual account'
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                            >
                              {item?.publicRole?.map(item => getPublicRoleLable(item)).join(', ')}
                            </Typography>
                          )}
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {item.userId !== userId && tabIndex === FollowListType.follower && item.loginUserFollowing && (
                    <Box className={'followerBtn'}>
                      <span className={'following'}>Following</span>
                      <span className={'unfollow'} onClick={() => triggerFollowItem(item)}>
                        Unfollow
                      </span>
                    </Box>
                  )}
                  {item.userId !== userId && tabIndex === FollowListType.follower && !item.loginUserFollowing && (
                    <Box className={'unfollowerBtn'}>
                      <span className={'following'} onClick={() => triggerFollowItem(item)}>
                        Follow
                      </span>
                      <span className={'unfollow'}>Follow</span>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          {isLoginUser && tabIndex === FollowListType.following && followingData.length === 0 && <NoData />}
          {isLoginUser &&
            tabIndex === FollowListType.following &&
            followingData &&
            followingData.length > 0 &&
            followingData.map((item, index) => (
              <Box sx={styles.followerItemStyle} key={index}>
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginRight: '10px'
                  }}
                >
                  <Avatar
                    src={item.avatar || DefaultAvatarSVG}
                    sx={{
                      position: 'relative',
                      width: '52px',
                      height: '52px',
                      marginRight: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => linkTopage(item)}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Stack direction={'row'} alignItems="center" spacing={8} mb={4}>
                      <Typography variant="body2" className="name" onClick={() => linkTopage(item)}>
                        {item.userType === USER_TYPE.USER ? item.fullName + ' # ' + item.fullNameId : item.fullName}
                      </Typography>
                      <VerifiedIcon isVerify={item?.isVerify} />
                    </Stack>

                    <Typography variant="body2" className="description">
                      {item.userType === USER_TYPE.COMPANY ? (
                        item.companyIntroduction || 'Company account'
                      ) : item.userType === USER_TYPE.INVESTOR ? (
                        item.companyIntroduction || 'Institutional investor'
                      ) : (
                        <>
                          {item.publicRole?.length === 0 ? (
                            'Individual account'
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                            >
                              {item?.publicRole?.map(item => getPublicRoleLable(item)).join(', ')}
                            </Typography>
                          )}
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {item.userId !== userId && tabIndex === FollowListType.following && item.loginUserFollowing && (
                    <Box className={'followingBtn'}>
                      <span className={'following'}>Following</span>
                      <span className={'unfollow'} onClick={() => triggerFollowItem(item)}>
                        Unfollow
                      </span>
                    </Box>
                  )}
                  {item.userId !== userId && tabIndex === FollowListType.following && !item.loginUserFollowing && (
                    <Box className={'unfollowingBtn'}>
                      <span className={'following'} onClick={() => triggerFollowItem(item)}>
                        Follow
                      </span>
                      <span className={'unfollow'}>Follow</span>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </DialogStyle>
  )
}

export default DialogFollowList
