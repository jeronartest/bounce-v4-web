import { Avatar, Divider, Link, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { RootState } from '@/store'
import { experienceItems } from 'api/profile/type'
import { IPager } from 'api/type'
import { getResumeExperience } from 'api/profile'
import { getPrimaryRoleLabel } from '@/utils'
import ViewMoreListBox from 'bounceComponents/company/ViewMoreListBox'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import VerifiedIcon from 'bounceComponents/common/VerifiedIcon'

export type IProfileExperienceProps = {
  personalInfoId: number
}

const ProfileExperience: React.FC<IProfileExperienceProps> = ({ personalInfoId }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)
  const router = useRouter()

  const [list, setList] = useState<experienceItems[]>([])

  useEffect(() => {
    setList([])
  }, [personalInfoId])

  const { data, loading, pagination } = usePagination<IPager<experienceItems>, Params>(
    async ({ current, pageSize }) => {
      const res = await getResumeExperience({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        userId: personalInfoId
      })
      return {
        total: res?.data?.total,
        list: res?.data?.list
      }
    },
    {
      defaultPageSize: 2,
      ready: !!personalInfoId,
      refreshDeps: [personalInfoId]
    }
  )

  useEffect(() => {
    data?.list?.length && setList(val => [...val, ...data?.list])
  }, [data?.list])

  const handleClick = useCallback(() => {
    pagination.changeCurrent(pagination.current + 1)
  }, [pagination])

  const handleLink = (item: experienceItems) => {
    if (item?.companyId) {
      return router.push(`/company/summary?id=${item?.companyId}`)
    }
    if (item?.thirdpartId) {
      return router.push(`/company/summary?thirdpartId=${item?.thirdpartId}`)
    }
    return
  }

  return list?.length ? (
    <ViewMoreListBox show={list?.length < data?.total} title="Experience" loading={loading} handleClick={handleClick}>
      <Stack spacing={32}>
        {list?.map((v, i) => (
          <Stack key={i} direction="row" spacing={20}>
            <Avatar
              alt=""
              src={v?.company?.avatar || CompanyDefaultSVG}
              sx={{
                width: 68,
                height: 68,
                '&:hover': {
                  cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default'
                }
              }}
              onClick={() => handleLink(v)}
            />
            <Stack spacing={8}>
              <Stack direction="row" spacing={14}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    lineHeight: '25px',
                    color: '#2663FF',
                    '&:hover': {
                      cursor: v?.companyId || v?.thirdpartId ? 'pointer' : 'default',
                      textDecoration: v?.companyId || v?.thirdpartId ? 'underline' : 'none'
                    }
                  }}
                  onClick={() => handleLink(v)}
                >
                  {v?.company?.name}
                </Typography>
                <VerifiedIcon isVerify={v.isVerify} />
                {v?.isCurrently === 2 && (
                  <Typography
                    variant="body2"
                    sx={{ background: ' rgba(23, 23, 23, 0.05)', borderRadius: 12, padding: '6px 8px' }}
                  >
                    Current job
                  </Typography>
                )}
              </Stack>
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
                <Typography variant="body2">{getPrimaryRoleLabel(v.position, optionDatas?.primaryRoleOpt)}</Typography>
                <Typography variant="body2">
                  {`${dayjs(v.startTime * 1000).format('YYYY')}-${
                    Number(v.isCurrently) === 2 ? 'Present' : dayjs(v.endTime * 1000).format('YYYY')
                  } (${dayjs(Number(v.isCurrently) === 2 ? dayjs() : dayjs(v.endTime * 1000)).diff(
                    dayjs(v.startTime * 1000),
                    'year'
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
                  WebkitLineClamp: 2
                }}
              >
                {v.description}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </ViewMoreListBox>
  ) : (
    <></>
  )
}

export default ProfileExperience
