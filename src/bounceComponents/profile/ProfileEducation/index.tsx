import { Avatar, Box, Divider, Link, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { RootState } from '@/store'
import { educationItems } from '@/api/profile/type'
import { IPager } from '@/api/type'
import { getResumeEducation } from '@/api/profile'
import { getLabel } from '@/utils'
import ViewMoreListBox from '@/components/company/ViewMoreListBox'
import EducationDefaultSVG from '@/assets/imgs/defaultAvatar/education.svg'

export type IProfileEducationProps = {
  personalInfoId: number
}

const ProfileEducation: React.FC<IProfileEducationProps> = ({ personalInfoId }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const [list, setList] = useState<educationItems[]>([])

  useEffect(() => {
    setList([])
  }, [personalInfoId])

  const { data, loading, pagination } = usePagination<IPager<educationItems>, Params>(
    async ({ current, pageSize }) => {
      const res = await getResumeEducation({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        userId: personalInfoId,
      })
      return {
        total: res?.data?.total,
        list: res?.data?.list,
      }
    },
    {
      defaultPageSize: 2,
      ready: !!personalInfoId,
      refreshDeps: [personalInfoId],
    },
  )

  useEffect(() => {
    data?.list?.length && setList((val) => [...val, ...data?.list])
  }, [data?.list])

  const handleClick = useCallback(() => {
    pagination.changeCurrent(pagination.current + 1)
  }, [pagination])

  return list?.length ? (
    <ViewMoreListBox show={list?.length < data?.total} title="Education" loading={loading} handleClick={handleClick}>
      <Stack spacing={32}>
        {list?.map((v, i) => (
          <Stack key={i} direction="row" spacing={20}>
            <Avatar
              alt=""
              src={v?.university?.avatar || EducationDefaultSVG}
              sx={{
                width: 68,
                height: 68,
                '&:hover': {
                  cursor: v?.university?.link ? 'pointer' : 'default',
                },
              }}
              component={'a'}
              target={v?.university?.link ? '_blank' : '_self'}
              href={v?.university?.link ? v?.university?.link : 'javascript:void(0)'}
            />
            <Stack spacing={8}>
              <Typography
                variant="body1"
                component={'a'}
                target={v?.university?.link ? '_blank' : '_self'}
                href={v?.university?.link ? v?.university?.link : 'javascript:void(0)'}
                sx={{
                  fontSize: '20px',
                  lineHeight: '25px',
                  color: '#2663FF',
                  marginBottom: 6,
                  wordBreak: 'break-word',
                  '&:hover': {
                    textDecoration: v?.university?.link ? 'underline' : 'none',
                    cursor: v?.university?.link ? 'pointer' : 'default',
                  },
                }}
              >
                {v?.university?.name}
              </Typography>
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
                <Typography variant="body2">{v.major}</Typography>
                <Typography variant="body2">
                  {`${dayjs(v.startTime * 1000).format('YYYY')}-${dayjs(v.endTime * 1000).format('YYYY')}(${dayjs(
                    v.endTime * 1000,
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
                  WebkitLineClamp: 2,
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

export default ProfileEducation
